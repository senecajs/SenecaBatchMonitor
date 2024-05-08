
type Table = {
  line: Record<string, Line>
  config: {
    start: number
    field: {
      line: string
    },
    line: {
      steps: StepDef[]
    }
  }
}


type StepDef = {
  name: string
  default: Record<string, any>
}


type Step = {
  state: 'init' | 'start' | 'warn' | 'fail' | 'done'
  start: number
  end: number
  more: Step[]
}

type Line = {
  step: Record<string, Step>
}


export type {
  Table,
  StepDef,
  Line,
  Step,
}


