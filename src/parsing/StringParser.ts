import { Parser } from "./Parser"
import { ParseResult, ok, err } from "./ParseResult"

export class StringParser extends Parser {
    constructor(private str: string, private value?: any, ignored: boolean = false) {
        super(ignored)

        if (!this.value) {
            this.value = str
        }
    }

    parse(input: string): ParseResult {
        if (input.startsWith(this.str)) {
            return ok(this.value, this.str, input.slice(this.str.length))
        } else {
            return err(input, `expected '${this.str}' but got '${input}'`)
        }
    }
}
