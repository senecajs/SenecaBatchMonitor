
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
  'skip' |    // Step has been skipped.
  'launch' |  // Step has sent all messages, but is not complete.
  'done' |    // Step is complete.
  'other'     // Step is in a non-standard state.
  start: number
  end: number

  // Reports are responsible for handling additional entries of same state.
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


