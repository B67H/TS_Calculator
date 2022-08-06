import "./style.css";

type Operator = "+" | "-" | "×" | "÷" | "=";
type ComputedValue = {
  [key in Exclude<Operator, "=">]: (num1: number, num2: number) => number;
};

interface CalculatorInterface {
  tempValue: string | number;
  tempOperator?: Operator | string;
  operator?: Operator | String;
  render(inputValue: string | number): void;
  reset(): void;
  Calculate(operator: Operator | string): void;
  initEvent(): void;
}

const VALID_NUMBER_OF_DIGITS = 3;
const INIT_VALUE = 0;
const OPERATORS = ["+", "-", "×", "÷"];

const validateNumberLength = (value: string | number) => {
  return String(value).length < VALID_NUMBER_OF_DIGITS;
};

const isZero = (value: string) => Number(value) === 0;

const getComputedValue: ComputedValue = {
  "×": (num1: number, num2: number) => num1 * num2,
  "+": (num1: number, num2: number) => num1 + num2,
  "-": (num1: number, num2: number) => num1 - num2,
  "÷": (num1: number, num2: number) => num1 / num2,
};

const Calculator: CalculatorInterface = {
  tempValue: INIT_VALUE,
  tempOperator: undefined,
  render(inputValue: string | number) {
    //const resultEl = document.querySelector('#result') as HTMLElement // 타입을 as로 단언해준다.
    const resultEl = <HTMLElement>document.querySelector("#result"); // 이런식으로도 타입 지정 가능
    const prevValue = resultEl.innerText;

    if (!validateNumberLength(prevValue)) {
      alert("3자리 이상의 수를 출력할 수 없습니다.");
      return;
    }

    if (resultEl) {
      resultEl.innerText = isZero(prevValue)
        ? String(inputValue)
        : String(prevValue + inputValue);
    }
  },
  reset() {
    const resultEl = <HTMLDivElement>document.querySelector("#result");
    resultEl.innerText = String(INIT_VALUE);
    this.tempOperator = undefined;
    this.tempValue = 0;
  },
  Calculate(operator: Operator | string) {
    const isTempCalculated = OPERATORS.includes(operator);
    const isReadyCalculated =
      operator === "=" &&
      this.tempOperator &&
      OPERATORS.includes(this.tempOperator);

    if (isTempCalculated) {
      const resultEl = <HTMLDivElement>document.querySelector("#result");

      this.tempOperator = operator;
      this.tempValue = Number(resultEl.innerText);

      resultEl.innerText = String(INIT_VALUE);
    }

    this.operator = operator;

    if (isReadyCalculated) {
      const resultEl = <HTMLDivElement>document.querySelector("#result");
      const resultVaule = getComputedValue[
        this.tempOperator as Exclude<Operator, "=">
      ](Number(this.tempValue), Number(resultEl.innerText));

      resultEl.innerText = String(resultVaule);
    }
  },
  initEvent() {
    const buttonContainerEl = document.querySelector(".contents");
    buttonContainerEl?.addEventListener("click", ({ target }) => {
      // 화살표함수를 사용해서 this의 타입지정 회피
      const buttonText = (target as HTMLButtonElement).innerText;

      if (buttonText === "AC") {
        this.reset();
        return;
      }
      if (OPERATORS.concat("=").includes(buttonText)) {
        this.Calculate(buttonText);
        return;
      }
      if (!Number.isNaN(buttonText)) {
        this.render(Number(buttonText));
      }
    });
  },
};

Calculator.render(INIT_VALUE);
Calculator.initEvent();
