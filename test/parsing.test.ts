import { Expression } from "typescript"
import { parse, any, countOf, manyOf, maybe, countRangeOf, sequence } from "../dist"

function generateTestNames([input, ast]) {
    return [ast.toString(), input, ast]
}

const SINGLE_LINE_CASES = [
    ["any", any()],
    ["5 of any", countOf(5, any())],
    ["many of any", manyOf(any())],
    ["maybe any", maybe(any())],
    ["1 to 5 of any", countRangeOf(1, 5, any())],
    ["maybe 5 of any", maybe(countOf(5, any()))],
    ["maybe many of any", maybe(manyOf(any()))],
].map(generateTestNames)

describe("single line expressions", () => {
    test.each(SINGLE_LINE_CASES)("%s", (_testName: string, input: string, expected: Expression) => {
        expect(parse(input)).toEqual(expected)
    })
})

const MULTI_LINE_CASES = [
    ["maybe\nany\nend", maybe(sequence([any()]))],
    ["many of\nany\nend", manyOf(sequence([any()]))],
    ["3 of\nany\nend", countOf(3, sequence([any()]))],
    ["3 to 5 of\nany\nend", countRangeOf(3, 5, sequence([any()]))],
    ["maybe\nany\nmaybe any\nend", maybe(sequence([any(), maybe(any())]))],
    [
        "maybe\nany\nmaybe any\nmany of any\nend",
        maybe(sequence([any(), maybe(any()), manyOf(any())])),
    ],
].map(generateTestNames)

describe("multi line expressions", () => {
    test.each(MULTI_LINE_CASES)("%s", (_testName: string, input: string, expected: Expression) => {
        expect(parse(input)).toEqual(expected)
    })
})

describe("multi line expressions with random white spaces", () => {
    test.each(MULTI_LINE_CASES)("%s", (_testName: string, input: string, expected: Expression) => {
        const randomWhitespace = () => " ".repeat(Math.random() * 4)
        input = input.replace("\n", `${randomWhitespace()}\n${randomWhitespace()}`)
        expect(parse(input)).toEqual(expected)
    })
})