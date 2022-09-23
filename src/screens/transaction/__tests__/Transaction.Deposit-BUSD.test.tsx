import React from "react"
import {Transaction} from "screens/transaction/Transaction"
import {TransactionViewModel} from "screens/transaction/TransactionViewModel"
import {BigNumber} from "@ethersproject/bignumber"
import {BorrowSupplyItem, FinanceCurrency} from "models/types"
import {TRANSACTION_TYPE} from "models/contracts/types"
import Big from "big.js"
import {render, fireEvent} from "@testing-library/react"

const mockNavigate = jest.fn()
const mockParams = jest.fn()
const mockHistory = jest.fn()

let transactionViewModel: TransactionViewModel

let nativePriceMock = {
  source: "coingecko",
  currency: "usd",
  time: "2022-08-25T06:48:16Z",
  price: 302.1598370529
} as FinanceCurrency

let item = {
  cToken: "0x24A2b865bB33A72Eec48F9Afe55002538d994766",
  exchangeRateCurrent: BigNumber.from("0xab80ff50843ed01eea4318"),
  supplyRatePerBlock: BigNumber.from("0x06a7f5072a"),
  borrowRatePerBlock: BigNumber.from("0x1965885213"),
  reserveFactorMantissa: BigNumber.from("0x00"),
  totalBorrows: BigNumber.from("0x36851aa2e5be8f93bc"),
  totalReserves: BigNumber.from("0x00"),
  totalSupply: BigNumber.from("0x10e10e85286c"),
  totalCash: BigNumber.from("0x99ecdbfc72fda3a3f0"),
  isListed: true,
  collateralFactorMantissa: BigNumber.from("0x0b1a2bc2ec500000"),
  underlyingAssetAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  cTokenDecimals: BigNumber.from("0x08"),
  underlyingDecimals: BigNumber.from("0x12"),
  token: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  symbol: "BUSD",
  name: "BUSD Token",
  cName: "Savy BUSD",
  liquidity: Big("2839.419356061224"),
  isEnteredTheMarket: true,
  supplyAllowed: true,
  borrowAllowed: true,
  underlyingPrice: BigNumber.from("0x0de0b6b3a7640000"),
  tokenBalance: BigNumber.from("0xe0e6e54cc165028d"),
  tokenAllowance: BigNumber.from("0xfffffffffffffffffffffffffffffffffffffffffffffffc2642ba8419ac12de"),
  borrowBalance: BigNumber.from("0x15a29b446df1e2"),
  supplyBalance: BigNumber.from("0xbfe6235048378385"),
  balanceOf: BigNumber.from("0x0f8732f2df"),
  balance: Big("16.205892426964206221"),
  supply: Big("13.827778533603640197"),
  borrow: Big("0.006089762262610402"),
  supplyApy: Big(6.19),
  borrowApy: Big(25.77),
  tokenUsdValue: Big(1),
  fiatSupply: Big("13.82777853360364"),
  fiatBorrow: Big("0.006089762262610402")
} as BorrowSupplyItem

let mockData = {
  item,
  transactionType: TRANSACTION_TYPE.DEPOSIT,
  borrowLimit: 11.06818170609075,
  totalBorrow: 0.006089762262610402
}

jest.mock('hooks/useSharedData', () => ({
  useSharedData: () => {
    return {
      data: mockData,
      setData: jest.fn
    }
  }
}))

jest.mock('react-router-dom', () => (
  {
    __esModule: true,
    ...jest.requireActual('react-router-dom') as any,
    useParams: () => mockParams,
    useHistory: () => mockHistory,
    useNavigate: () => mockNavigate
  }
))

jest.mock("utils/hoc", () => (
  {
    withStore: (Store: any, Component: any) => {
      return ({...props}) => {
        return <Component view={transactionViewModel} {...props} />
      }
    }
  }
))

describe("Transaction screen with data for DEPOSIT/BUSD", () => {
  beforeEach(() => {
    transactionViewModel = new TransactionViewModel()
    transactionViewModel.nativeCoinPrice = nativePriceMock
    jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect)
  })

  afterEach(() => {
    jest.spyOn(React, 'useEffect').mockRestore()
  })

  it("should match data", () => {
    let transactionScreen = render(<Transaction/>)

    expect(transactionViewModel.getTokenSymbol).toBe("BUSD")
    expect(transactionViewModel.balance.toString()).toBe(item.balance.toString())
    expect(transactionViewModel.isDeposit).toBe(true)
    expect(transactionViewModel.isRepay).toBe(false)
    expect(transactionViewModel.isWithdraw).toBe(false)
    expect(transactionViewModel.isBorrow).toBe(false)
    expect(transactionViewModel.isWBGL).toBe(false)
    expect(transactionViewModel.isBUSD).toBe(true)
    expect(transactionViewModel.getInputFontSize).toBe("32px")
    expect(transactionViewModel.tokenBalance.toString()).toBe(item.balance.toString())
    expect(transactionViewModel.titleBasedOnType).toBe("home.deposit")
    expect(transactionViewModel.buttonTitleBasedOnType).toBe("home.deposit $0")
    expect(transactionViewModel.isRepayDisabled).toBe(false)
    expect(transactionViewModel.hypotheticalBorrowLimitUsedForDeposit).toBe(0)
    expect(transactionViewModel.hypotheticalCollateralSupply).toBe(0)
    expect(transactionViewModel.hypotheticalBorrowLimitUsed).toBe(0)
    expect(transactionViewModel.isSupplyDisabled).toBe(false)
    expect(transactionViewModel.buttonColor).toBe("")
    expect(transactionViewModel.isMaxValueSet).toBe(false)
    expect(transactionViewModel.isEnoughBalance).toBe(true)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should lower input font size', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    fireEvent.change(input, {target: {value: '10.101010'}})
    expect(transactionViewModel.inputValue).toBe("10.101010")
    expect(transactionViewModel.getInputFontSize).toBe("26px")

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('button should be enabled, and balance is greater than input', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    // amount lower than token balance
    fireEvent.change(input, {target: {value: '2'}})
    expect(transactionViewModel.isEnoughBalance).toBe(true)
    expect(transactionViewModel.isButtonDisabled).toBe(false)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('button should be disabled if input value is 0', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    fireEvent.change(input, {target: {value: '0'}})
    expect(transactionViewModel.isButtonDisabled).toBe(true)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('button should be disabled if input value starts with leading zeros like 0001', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    fireEvent.change(input, {target: {value: '0001'}})
    expect(transactionViewModel.isButtonDisabled).toBe(true)

    fireEvent.change(input, {target: {value: ''}})
    fireEvent.change(input, {target: {value: '0.000000'}})
    expect(transactionViewModel.isButtonDisabled).toBe(true)

    fireEvent.change(input, {target: {value: ''}})
    fireEvent.change(input, {target: {value: '0000.0000001'}})
    expect(transactionViewModel.isButtonDisabled).toBe(true)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('button should be enabled, and balance is equal to input', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    // amount greater or equals to token balance
    fireEvent.change(input, {target: {value: '16.205892426964206221'}})
    expect(transactionViewModel.isEnoughBalance).toBe(true)
    expect(transactionViewModel.isButtonDisabled).toBe(false)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('button should be disabled, and balance is lower than input', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    // amount greater than token balance
    fireEvent.change(input, {target: {value: '17.456811'}})
    expect(transactionViewModel.isEnoughBalance).toBe(false)
    expect(transactionViewModel.isButtonDisabled).toBe(true)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('max is set', () => {
    const transactionScreen = render(<Transaction/>)
    const max = transactionScreen.getByLabelText('max-button') as any

    fireEvent.click(max)
    expect(transactionViewModel.inputValue).toBe(item.balance.toString())
    expect(transactionViewModel.isEnoughBalance).toBe(true)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('set max and clear with input', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any
    const max = transactionScreen.getByLabelText('max-button') as any

    fireEvent.click(max)
    expect(transactionViewModel.inputValue).toBe(item.balance.toString())
    expect(transactionViewModel.isMaxValueSet).toBe(true)

    fireEvent.change(input, {target: {value: '12'}})
    expect(transactionViewModel.inputValue).toBe("12")
    expect(transactionViewModel.isMaxValueSet).toBe(false)

    fireEvent.change(input, {target: {value: '16.205892426964206221'}})
    expect(transactionViewModel.inputValue).toBe(item.balance.toString())
    expect(transactionViewModel.isMaxValueSet).toBe(true)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should handle inputSwap on swap', () => {
    const transactionScreen = render(<Transaction/>)
    const swap = transactionScreen.getByLabelText('swap-button') as any

    expect(transactionViewModel.inputFiat).toBe(false)
    fireEvent.click(swap)
    expect(transactionViewModel.inputFiat).toBe(true)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should change input value from token to fiat on swap', () => {
    const transactionScreen = render(<Transaction/>)
    const swap = transactionScreen.getByLabelText('swap-button') as any
    const input = transactionScreen.getByLabelText('cost-input') as any

    expect(transactionViewModel.inputValueToken).toBe(0)
    expect(transactionViewModel.inputValueFiat).toBe(0)

    fireEvent.change(input, {target: {value: '100'}})

    expect(transactionViewModel.inputValue).toBe('100')
    expect(transactionViewModel.getInputValueForTransaction).toBe('100')
    fireEvent.click(swap)
    expect(transactionViewModel.inputValue).toBe('100')
    expect(transactionViewModel.getInputValueForTransaction).toBe('100')
    fireEvent.click(swap)
    expect(transactionViewModel.inputValue).toBe('100')
    expect(transactionViewModel.getInputValueForTransaction).toBe('100')
    fireEvent.click(swap)
    expect(transactionViewModel.inputValue).toBe('100')
    expect(transactionViewModel.getInputValueForTransaction).toBe('100')

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should change usd to token symbol when swap', () => {
    const transactionScreen = render(<Transaction/>)
    const swap = transactionScreen.getByLabelText('swap-button') as any

    expect(transactionViewModel.getTokenOrFiat).toBe("BUSD")
    fireEvent.click(swap)
    expect(transactionViewModel.getTokenOrFiat).toBe("USD")

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should handle max on swap', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any
    const max = transactionScreen.getByLabelText('max-button') as any
    const swap = transactionScreen.getByLabelText('swap-button') as any

    fireEvent.click(max)
    expect(transactionViewModel.inputValue).toBe(item.balance.toString())
    expect(transactionViewModel.isMaxValueSet).toBe(true)
    fireEvent.click(swap)
    expect(transactionViewModel.isMaxValueSet).toBe(true)
    fireEvent.click(swap)
    expect(transactionViewModel.isMaxValueSet).toBe(true)
    fireEvent.click(swap)
    expect(transactionViewModel.isMaxValueSet).toBe(true)
    expect(transactionViewModel.inputValue).toBe(Big(item.balance).mul(item.tokenUsdValue).toString())
    fireEvent.change(input, {target: {value: '0.28772216'}})
    expect(transactionViewModel.isMaxValueSet).toBe(false)
    fireEvent.change(input, {target: {value: '0'}})
    expect(transactionViewModel.isMaxValueSet).toBe(false)
    fireEvent.click(swap)
    expect(transactionViewModel.inputValue).toBe('0')
    fireEvent.click(max)
    expect(transactionViewModel.inputValue).toBe(item.balance.toString())
    expect(transactionViewModel.isMaxValueSet).toBe(true)
    fireEvent.change(input, {target: {value: '12'}})
    expect(transactionViewModel.isMaxValueSet).toBe(false)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should return tokens max value on swap before transaction', () => {
    const transactionScreen = render(<Transaction/>)
    const max = transactionScreen.getByLabelText('max-button') as any
    const swap = transactionScreen.getByLabelText('swap-button') as any

    fireEvent.click(max)
    expect(transactionViewModel.inputValue).toBe(item.balance.toString())
    expect(transactionViewModel.isMaxValueSet).toBe(true)
    expect(transactionViewModel.getInputValueForTransaction).toBe(item.balance.toString())

    fireEvent.click(swap)
    expect(transactionViewModel.inputValue).toBe(Big(item.balance).mul(item.tokenUsdValue).toString())
    expect(transactionViewModel.isMaxValueSet).toBe(true)
    expect(transactionViewModel.getInputValueForTransaction).toBe(item.balance.toString())

    fireEvent.click(swap)
    expect(transactionViewModel.inputValue).toBe(item.balance.toString())
    expect(transactionViewModel.isMaxValueSet).toBe(true)
    expect(transactionViewModel.getInputValueForTransaction).toBe(item.balance.toString())

    fireEvent.click(swap)
    expect(transactionViewModel.inputValue).toBe(Big(item.balance).mul(item.tokenUsdValue).toString())
    expect(transactionViewModel.isMaxValueSet).toBe(true)
    expect(transactionViewModel.getInputValueForTransaction).toBe(item.balance.toString())

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should return token decimals', () => {
    const transactionScreen = render(<Transaction/>)

    expect(+transactionViewModel.item.underlyingDecimals).toBe(18)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should handle safe input value', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    expect(transactionViewModel.safeInputValue).toBe("0")
    fireEvent.change(input, {target: {value: '1'}})
    expect(transactionViewModel.safeInputValue).toBe("1")
    fireEvent.change(input, {target: {value: ''}})
    expect(transactionViewModel.safeInputValue).toBe("0")

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should handle inputValueTOKEN', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any
    const swap = transactionScreen.getByLabelText('swap-button') as any

    fireEvent.change(input, {target: {value: '1'}})
    expect(transactionViewModel.inputValueTOKEN.toString()).toBe("1")
    fireEvent.click(swap)
    expect(transactionViewModel.inputValueTOKEN.toString()).toBe("1")
    fireEvent.click(swap)
    fireEvent.change(input, {target: {value: '11'}})
    expect(transactionViewModel.inputValueTOKEN.toString()).toBe("11")
    fireEvent.click(swap)

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should handle input with dot at the beginning', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    fireEvent.change(input, {target: {value: '.'}})
    expect(transactionViewModel.inputValue).toBe("0.")

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should handle input with double zero', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    fireEvent.change(input, {target: {value: '0'}})
    expect(transactionViewModel.inputValue).toBe("0")

    fireEvent.change(input, {target: {value: '00'}})
    expect(transactionViewModel.inputValue).toBe("0")

    fireEvent.change(input, {target: {value: ''}})
    expect(transactionViewModel.inputValue).toBe("")

    fireEvent.change(input, {target: {value: '.'}})
    expect(transactionViewModel.inputValue).toBe("0.")

    fireEvent.change(input, {target: {value: ''}})
    fireEvent.change(input, {target: {value: '00.10'}})
    expect(transactionViewModel.inputValue).toBe("")

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should handle set input correctly', () => {
    const transactionScreen = render(<Transaction/>)

    transactionViewModel.setInputValue("123")
    expect(transactionViewModel.inputValue).toBe("123")

    transactionViewModel.setInputValue("123.45")
    expect(transactionViewModel.inputValue).toBe("123.45")

    transactionViewModel.setInputValue("0.12345")
    expect(transactionViewModel.inputValue).toBe("0.12345")

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })

  it('should handle set input with incorrect input data', () => {
    const transactionScreen = render(<Transaction/>)

    transactionViewModel.setInputValue("")
    expect(transactionViewModel.inputValue).toBe("")

    transactionViewModel.setInputValue("undefined")
    expect(transactionViewModel.inputValue).toBe("")

    transactionViewModel.setInputValue("null")
    expect(transactionViewModel.inputValue).toBe("")

    transactionViewModel.setInputValue("123testabcdef")
    expect(transactionViewModel.inputValue).toBe("")

    transactionViewModel.setInputValue("00.123")
    expect(transactionViewModel.inputValue).toBe("")

    transactionViewModel.setInputValue("00.123.123")
    expect(transactionViewModel.inputValue).toBe("")

    transactionViewModel.setInputValue(".")
    expect(transactionViewModel.inputValue).toBe("0.")

    expect(transactionScreen.container).toMatchSnapshot()
    transactionScreen.unmount()
  })
})
