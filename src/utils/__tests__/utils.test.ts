import {formatValue, round} from "../utils"

describe("utils", () => {
  it('should round number correctly', function () {
    expect(round(10, 10)).toBe(10)
    expect(round(100, 10)).toBe(100)
    expect(round(9.9, 1)).toBe(9.9)
    expect(round(4.5, 10)).toBe(4.5)
  })

  it('should format number with/without currency correctly', function () {
    expect(formatValue(100)).toBe('$100.0000')
    expect(formatValue(100, 0)).toBe('$100')
    expect(formatValue(0, 0)).toBe('$0')
    expect(formatValue(0, 0, '')).toBe('0')
    expect(formatValue(0.01)).toBe('$0.0100')
    expect(formatValue(0.001)).toBe('$0.0010')
    expect(formatValue(0.01, 2)).toBe('$0.01')
  })
})
