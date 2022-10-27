import { cleanDust, convertValue, cutString, DIGITS_INPUT, NUMBER } from "../common"

describe("common", () => {
  it('should not pass reg check', function () {
    expect(
      NUMBER.test("test")
    ).toBe(false)
    expect(
      NUMBER.test("1d.1")
    ).toBe(false)
    expect(
      NUMBER.test("11111a")
    ).toBe(false)
    expect(
      NUMBER.test("0x123a")
    ).toBe(false)
    expect(
      DIGITS_INPUT.test("0x123a")
    ).toBe(false)
    expect(
      DIGITS_INPUT.test("test")
    ).toBe(false)
    expect(
      DIGITS_INPUT.test("1d.1")
    ).toBe(false)
    expect(
      DIGITS_INPUT.test("11111a")
    ).toBe(false)
    expect(
      DIGITS_INPUT.test("0x123a")
    ).toBe(false)
  })

  it('should pass reg check for only digits', function () {
    expect(
      DIGITS_INPUT.test("0")
    ).toBe(true)
    expect(
      DIGITS_INPUT.test("0.01")
    ).toBe(true)
    expect(
      DIGITS_INPUT.test("1111.1000")
    ).toBe(true)
    expect(
      DIGITS_INPUT.test("12340")
    ).toBe(true)
  })

  it('should check if input is valid', function () {
    expect(
      NUMBER.test("0")
    ).toBe(false)
    expect(
      NUMBER.test("0.1")
    ).toBe(true)
    expect(
      NUMBER.test("0.01")
    ).toBe(true)
    expect(
      NUMBER.test("0.001")
    ).toBe(true)
    expect(
      NUMBER.test("110.001234")
    ).toBe(true)
    expect(
      NUMBER.test("10.001")
    ).toBe(true)
    expect(
      NUMBER.test("10.0001")
    ).toBe(true)
    expect(
      NUMBER.test("10.00001")
    ).toBe(true)
    expect(
      NUMBER.test("10.000001")
    ).toBe(true)
    expect(
      NUMBER.test("10.0000001")
    ).toBe(true)
    expect(
      NUMBER.test("10.00000001")
    ).toBe(true)
    expect(
      NUMBER.test("10.000000001")
    ).toBe(true)
    expect(
      NUMBER.test("10.0000000001")
    ).toBe(true)
    expect(
      NUMBER.test("10.00000000001")
    ).toBe(true)
    expect(
      NUMBER.test("10.000000000001")
    ).toBe(true)
    expect(
      NUMBER.test("10.0000000000001")
    ).toBe(true)
    expect(
      NUMBER.test("1.000000000000001")
    ).toBe(false)
  })

  it('cut string function should handle undefined and null values', function () {
    expect(cutString(undefined)).toBe('')
    expect(cutString(null)).toBe('')
    expect(cutString('')).toBe('')
  })

  it('cut string function should handle strings correctly', function () {
    expect(cutString('0')).toBe('0')
    expect(cutString('0.1')).toBe('0.1')
    expect(cutString('0.11')).toBe('0.11')
    expect(cutString('0.1122')).toBe('0.1122')
    expect(cutString('10.1122')).toBe('10.1122')
    expect(cutString('0.1122101010101')).toBe('0.1122101010101')
    expect(cutString('0.11221010101014567')).toBe('0.11221010101014')
    expect(cutString('0.112210101010145678')).toBe('0.11221010101014')
    expect(cutString('0.1122101010101456789')).toBe('0.11221010101014')
    expect(cutString('1.1122101010101456789')).toBe('1.11221010101014')
    expect(cutString('11.1122101010101456789')).toBe('11.1122101010101')
    expect(cutString('1024.10')).toBe('1024.10')
    expect(cutString('10000')).toBe('10000')
    expect(cutString('10240')).toBe('10240')
    expect(cutString('10244')).toBe('10244')
    expect(cutString('50')).toBe('50')
    expect(cutString('40')).toBe('40')
    expect(cutString('30')).toBe('30')
    expect(cutString('20')).toBe('20')
    expect(cutString('10')).toBe('10')
    expect(cutString('10.56')).toBe('10.56')
    expect(cutString('110.156')).toBe('110.156')
  })

  it('clean dust function should handle undefined and null values', function () {
    expect(cleanDust(undefined)).toBe('')
    expect(cleanDust(null)).toBe('')
    expect(cleanDust('')).toBe('')
  })

  it('clean dust function should handle strings correctly', function () {
    expect(cleanDust('0')).toBe('0')
    expect(cleanDust('1')).toBe('1')
    expect(cleanDust('2')).toBe('2')
    expect(cleanDust('3')).toBe('3')
    expect(cleanDust('10')).toBe('10')
    expect(cleanDust('100')).toBe('100')
    expect(cleanDust('10000000')).toBe('10000000')
    expect(cleanDust('20000000')).toBe('20000000')
    expect(cleanDust('30000000')).toBe('30000000')
    expect(cleanDust('30000001')).toBe('30000001')
    expect(cleanDust('110000001110000')).toBe('110000001110000')
    expect(cleanDust('110000001110000.1')).toBe('110000001110000')
    expect(cleanDust('110000001110000.11')).toBe('110000001110000')
    expect(cleanDust('110000001110000.1121')).toBe('110000001110000')
    expect(cleanDust('110000001110000.0011223')).toBe('110000001110000')
  })

  it('convert value function should convert values with token decimals', function () {
    expect(convertValue(undefined)).toBe('0')
    expect(convertValue(null)).toBe('0')
    expect(convertValue("10.000001")).toBe("10000001000000000000")
    expect(convertValue("1240.000001")).toBe("1240000001000000000000")
    expect(convertValue("0.000001")).toBe("1000000000000")
    expect(convertValue("0.000012456")).toBe("12456000000000")
    expect(convertValue("1.00001245623131")).toBe("1000012456231310000")
    expect(convertValue("1.000012456231315665")).toBe("1000012456231315665")
    expect(convertValue("1.000012456231315665")).toBe("1000012456231315665")
    expect(convertValue(cutString("1.000012456231315665"))).toBe("1000012456231310000")
  })
})
