import { spaces } from "./commonParsers"
import { expressionOrBlock } from "./Expression"
import { ExpressionType } from "./ExpressionType"
import { ANY, OF } from "./keywords"
import { number } from "./NumberParser"
import { SequenceParser } from "./Sequence"

export { ExpressionType } from "./ExpressionType"

export class Expression {
    constructor(public type: ExpressionType, public value: any) {}

    toString(): string {
        return `${this.type}(${this.value.toString()})`
    }
}

export class CountOf extends Expression {
    public static parser = new SequenceParser([number, spaces, OF, expressionOrBlock]).builder(
        (value: any[]) => countOf(value[0], value[1])
    )

    constructor(public count: number, value: Expression) {
        super(ExpressionType.COUNT_OF, value)
    }

    toString(): string {
        return `${this.type}(${this.count}, ${this.value.toString()})`
    }
}

export class CountRangeOf extends Expression {
    constructor(public from: number, public to: number, value: Expression) {
        super(ExpressionType.COUNT_RANGE, value)
    }

    toString(): string {
        return `${this.type}(${this.from}, ${this.to}, ${this.value.toString()})`
    }
}

export class Sequence extends Expression {
    constructor(value: Expression[]) {
        super(ExpressionType.SEQUENCE, value)
    }

    toString(): string {
        return `${this.type}(${this.value.map((v: Expression) => v.toString()).join(", ")})`
    }
}

export class Literal extends Expression {
    constructor(value: string) {
        super(ExpressionType.LITERAL, value)
    }

    toString(): string {
        return `${this.type}(${this.value})`
    }
}

export function literal(value: string): Literal {
    return new Literal(value)
}

export class Any extends Expression {
    public static parser = ANY.builder(() => new Any())

    constructor() {
        super(ExpressionType.ANY, "any")
    }

    toString(): string {
        return this.type.toString()
    }
}

export function any(): Any {
    return new Any()
}

export function countOf(count: number, value: any): CountOf {
    return new CountOf(count, value)
}

export function countRangeOf(from: number, to: number, value: any): CountRangeOf {
    return new CountRangeOf(from, to, value)
}

export function manyOf(value: Expression): Expression {
    return new Expression(ExpressionType.MANY, value)
}

export function maybe(value: any): Expression {
    return new Expression(ExpressionType.MAYBE, value)
}

export function sequence(value: Expression[]): Sequence {
    return new Sequence(value)
}
