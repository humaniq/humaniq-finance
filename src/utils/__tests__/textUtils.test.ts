import {capitalize, hexToDecimal, isEmpty, renderShortAddress, toLowerCase, toUpperCase} from "../textUtils"

describe("textUtils", () => {
  it('should capitalize first letter', function () {
    expect(capitalize("test")).toBe("Test")
    expect(capitalize("Test")).toBe("Test")
    expect(capitalize(undefined)).toBe("")
    expect(capitalize(null)).toBe("")
  })

  it('should make all letters upper case', function () {
    expect(toUpperCase("test")).toBe("TEST")
    expect(toUpperCase("TeSt")).toBe("TEST")
    expect(toUpperCase(undefined)).toBe("")
    expect(toUpperCase(null)).toBe("")
  })

  it('should make all letters lower case', function () {
    expect(toLowerCase("TEST")).toBe("test")
    expect(toLowerCase("TeSt")).toBe("test")
    expect(toLowerCase(undefined)).toBe("")
    expect(toLowerCase(null)).toBe("")
  })

  it('should check if string is empty', function () {
    expect(isEmpty("TEST")).toBe(false)
    expect(isEmpty("")).toBe(true)
    expect(isEmpty(" ")).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty(null)).toBe(true)
  })

  it('should convert hex number to decimal number', function () {
    expect(hexToDecimal("0x0")).toBe(0)
    expect(hexToDecimal("0x1")).toBe(1)
    expect(hexToDecimal("0x11")).toBe(17)
    expect(hexToDecimal("0x1001")).toBe(4097)
    expect(hexToDecimal("0x96")).toBe(150)
  })

  it('should render short address correctly', function () {
    expect(renderShortAddress("0x22222233344444555556666667Fa663e111aa111")).toBe("0x22...a111")
  })
})
