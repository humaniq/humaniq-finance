import React from "react"
import {Transaction} from "screens/transaction/Transaction"
import {TransactionViewModel} from "screens/transaction/TransactionViewModel"
import {BigNumber} from "@ethersproject/bignumber"
import {BorrowSupplyItem} from "models/types"
import {TRANSACTION_TYPE} from "models/contracts/types"
import Big from "big.js"
import {render, fireEvent} from "@testing-library/react"

const mockNavigate = jest.fn()
const mockParams = jest.fn()
const mockHistory = jest.fn()

let transactionViewModel: TransactionViewModel;

let item = {
  cToken:"0x5CFeBb423417B1424b4F27BB5aD4f3B90ff49A30",
  exchangeRateCurrent: BigNumber.from("0xbb2579081993960d3d1d98"),
  supplyRatePerBlock: BigNumber.from("0x2bc88b3726"),
  borrowRatePerBlock: BigNumber.from("0x2bedf739cf"),
  reserveFactorMantissa: BigNumber.from("0x00"),
  totalBorrows: BigNumber.from("0x0de121f58861e54dbab1"),
  totalReserves: BigNumber.from("0x00"),
  totalSupply: BigNumber.from("0x0108c5c24bbc66"),
  totalCash: BigNumber.from("0x0be19bb643266855e9"),
  isListed: true,
  collateralFactorMantissa: BigNumber.from("0x0b1a2bc2ec500000"),
  underlyingAssetAddress: "0x2bA64EFB7A4Ec8983E22A49c81fa216AC33f383A",
  cTokenDecimals: BigNumber.from("0x08"),
  underlyingDecimals: BigNumber.from("0x12"),
  token: "0x2bA64EFB7A4Ec8983E22A49c81fa216AC33f383A",
  symbol: "WBGL",
  name: "Wrapped BGL",
  cName: "Savy WBGL",
  liquidity: Big(2.866379346099819),
  isEnteredTheMarket: true,
  supplyAllowed: true,
  borrowAllowed: true,
  underlyingPrice: BigNumber.from("0x2e76a059ac5000"),
  tokenBalance: BigNumber.from("0x98a7d9b8314c0000"),
  tokenAllowance: BigNumber.from("0xfffffffffffffffffffffffffffffffffffffffffffffffad04dceed828b4712"),
  borrowBalance: BigNumber.from("0x00"),
  supplyBalance: BigNumber.from("0x0529e5809ae1e04f95"),
  balanceOf: BigNumber.from("0x6205ac763f"),
  balance: Big(11),
  supply: Big(95.252680896472436629),
  borrow: Big(0),
  supplyApy: Big(48.46),
  borrowApy: Big(48.65),
  tokenUsdValue: Big(0.01307828),
  fiatSupply: Big(1.2457412315147176),
  fiatBorrow: Big(0)
} as BorrowSupplyItem

let mockData = {
  item,
  transactionType: TRANSACTION_TYPE.DEPOSIT,
  borrowLimit: 1.0248881907776854,
  totalBorrow: 1.0207271268955869
}

jest.mock('hooks/useSharedData', () => ({
  useSharedData: () => {
    return {
      data: mockData,
      setData: jest.fn
    }
  }
}))

beforeAll(() => {
  transactionViewModel = new TransactionViewModel();
  jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect)
})

afterAll(() => {
  jest.spyOn(React, 'useEffect').mockRestore()
})

jest.mock('react-router-dom', () => (
  {
    __esModule: true,
    ...jest.requireActual('react-router-dom') as any,
    useParams: () => mockParams,
    useHistory: () => mockHistory,
    useNavigate: () => mockNavigate,
  }
));

jest.mock("utils/hoc", () => (
  {
    withStore: (Store: any, Component: any) => {
      return ({ ...props }) => {
        return <Component view={transactionViewModel} {...props} />;
      };
    },
  }
));

describe("Transaction screen with data for DEPOSIT/WBGL", () => {
  it("should match data", () => {
    // const { toJSON } = renderer.create(<Transaction />);
    let transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    expect(transactionViewModel.getTokenSymbol).toBe("WBGL");
    expect(transactionViewModel.balance.toString()).toBe(item.balance.toString());
    expect(transactionViewModel.isDeposit).toBe(true);
    expect(transactionViewModel.isRepay).toBe(false);
    expect(transactionViewModel.isWithdraw).toBe(false);
    expect(transactionViewModel.isBorrow).toBe(false);
    expect(transactionViewModel.isWBGL).toBe(true);
    expect(transactionViewModel.isBUSD).toBe(false);
    expect(transactionViewModel.getInputFontSize).toBe("32px");
    expect(transactionViewModel.tokenBalance.toString()).toBe(item.balance.toString());
    expect(transactionViewModel.titleBasedOnType).toBe("home.deposit")
    expect(transactionViewModel.buttonTitleBasedOnType).toBe("home.deposit $0")
    expect(transactionViewModel.isRepayDisabled).toBe(false)
    expect(transactionViewModel.hypotheticalBorrowLimitUsedForDeposit).toBe(0)
    expect(transactionViewModel.hypotheticalCollateralSupply).toBe(0)
    expect(transactionViewModel.hypotheticalBorrowLimitUsed).toBe(0)
    expect(transactionViewModel.isSupplyDisabled).toBe(false)
    expect(transactionViewModel.supplyTitle).toBe("home.deposit")
    expect(transactionViewModel.buttonColor).toBe("")
    expect(transactionViewModel.isMaxValueSet).toBe(false)
    expect(transactionViewModel.isEnoughBalance).toBe(true)
    transactionScreen.unmount()
  });

  it('should lower input font size', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    fireEvent.change(input, {target: {value: '10.101010'}})
    expect(input.value).toBe("10.101010")
    expect(transactionViewModel.getInputFontSize).toBe("26px");

    transactionScreen.unmount()
  })

  it('button should be enabled, and balance is greater than input', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    // amount lower than token balance
    fireEvent.change(input, {target: {value: '10'}})
    expect(transactionViewModel.isEnoughBalance).toBe(true)
    expect(transactionViewModel.isButtonDisabled).toBe(false)

    transactionScreen.unmount()
  })

  it('button should be enabled, and balance is equal to input', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    // amount greater equals to token balance
    fireEvent.change(input, {target: {value: '11'}})
    expect(transactionViewModel.isEnoughBalance).toBe(true)
    expect(transactionViewModel.isButtonDisabled).toBe(false)

    transactionScreen.unmount()
  })

  it('button should be disabled, and balance is lower than input', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any

    // amount greater than token balance
    fireEvent.change(input, {target: {value: '12'}})
    expect(transactionViewModel.isEnoughBalance).toBe(false)
    expect(transactionViewModel.isButtonDisabled).toBe(true)

    transactionScreen.unmount()
  })

  it('max is set', () => {
    const transactionScreen = render(<Transaction/>)
    const input = transactionScreen.getByLabelText('cost-input') as any
    const max = transactionScreen.getByLabelText('max-button') as any

    fireEvent.click(max)
    expect(input.value).toBe("11")

    transactionScreen.unmount()
  })
});
