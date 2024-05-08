
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
  state:
  'init' |    // Before step starts.
  'start' |   // Step has started.
  'warn' |    // Step has a warning (further warnings in `more`)
  'fail' |    // Step has failed.
  'launch' |  // Step has sent all messages, but is not complete.
  'done'      // Step is complete.
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


