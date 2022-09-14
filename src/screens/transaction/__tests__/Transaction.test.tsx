import React from "react"
import {Transaction} from "screens/transaction/Transaction"
import renderer from 'react-test-renderer'
import {TransactionViewModel} from "screens/transaction/TransactionViewModel"

const mockNavigate = jest.fn()
const mockParams = jest.fn()
const mockHistory = jest.fn()
const mockSetData = jest.fn()
const mockLocationReplace = jest.fn()

const TEST_URL = "https://some-url.com/#/details"

let transactionViewModel: TransactionViewModel;

jest.mock('hooks/useSharedData', () => ({
  useSharedData: () => {
    return {
      data: null,
      setData: () => mockSetData
    }
  }
}))

beforeAll(() => {
  transactionViewModel = new TransactionViewModel();
  jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect)

  window = Object.create(window);
  Object.defineProperty(window, "location", {
    value: {
      replace: (url: string) => mockLocationReplace(url),
      href: TEST_URL
    },
    writable: true
  });
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

describe("Transaction screen with not defined data", () => {
  let mockSetData = jest.fn()
  let mockData: any;

  it("should navigate back if data is null", () => {
    mockData = null

    jest.mock('hooks/useSharedData', () => ({
      useSharedData: () => {
        return {
          data: mockData,
          setData: () => mockSetData
        }
      }
    }))

    const { toJSON } = renderer.create(<Transaction />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("should navigate back if data is not defined", () => {
    mockData = undefined

    jest.mock('hooks/useSharedData', () => ({
      useSharedData: () => {
        return {
          data: mockData,
          setData: () => mockSetData
        }
      }
    }))

    const { toJSON } = renderer.create(<Transaction />);
    expect(toJSON()).toMatchSnapshot();
  });
});
