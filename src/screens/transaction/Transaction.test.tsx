import {Transaction} from "./Transaction"
import renderer from 'react-test-renderer';

describe("Transaction screen component", () => {
  it("should natch snapshot", () => {
    const { toJSON } = renderer.create(<Transaction />);
    expect(toJSON()).toMatchSnapshot();
  });
});
