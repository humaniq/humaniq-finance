import * as renderer from 'react-test-renderer';
import {MainInfoHeader} from "./MainInfoHeader"

describe("MainInfoHeader component", () => {
  it("should natch snapshot", () => {
    const { toJSON } = renderer.create(<MainInfoHeader><div></div></MainInfoHeader>);
    expect(toJSON()).toMatchSnapshot();
  });
});
