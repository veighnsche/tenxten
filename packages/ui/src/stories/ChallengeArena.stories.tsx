import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import {
  ChallengeArena,
  ChallengeMain,
  ChallengePanel,
  ChallengeHeader,
  ChallengeHeaderGroup,
  TrackBadge,
  ChallengeTimer,
  ChallengeStatus,
  ProblemPanel,
  CodeEditorPanel,
  CodeEditorActions,
  TestPanel,
  TestProgressBar,
} from "@/components/challenge"
import type { TestCase } from "@/components/challenge"

const meta: Meta = {
  title: "Challenge/Arena",
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

const sampleProblem = {
  title: "Implement LRU Cache",
  difficulty: "hard" as const,
  domain: "Data Structures",
  description: (
    <>
      <p>
        Design a data structure that follows the constraints of a{" "}
        <strong>Least Recently Used (LRU) cache</strong>.
      </p>
      <p>Implement the <code>LRUCache</code> class:</p>
      <ul>
        <li>
          <code>LRUCache(int capacity)</code> Initialize the LRU cache with
          positive size capacity.
        </li>
        <li>
          <code>int get(int key)</code> Return the value of the key if the key
          exists, otherwise return -1.
        </li>
        <li>
          <code>void put(int key, int value)</code> Update the value of the key
          if the key exists. Otherwise, add the key-value pair to the cache. If
          the number of keys exceeds the capacity, evict the least recently used
          key.
        </li>
      </ul>
      <p>
        The functions <code>get</code> and <code>put</code> must each run in{" "}
        <strong>O(1)</strong> average time complexity.
      </p>
    </>
  ),
  examples: [
    {
      input: `LRUCache cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);    // returns 1
cache.put(3, 3); // evicts key 2
cache.get(2);    // returns -1`,
      output: `[null, null, null, 1, null, -1]`,
      explanation:
        "After putting keys 1 and 2, getting key 1 makes it recently used. When putting key 3, key 2 is evicted as it was least recently used.",
    },
  ],
  constraints: [
    "1 <= capacity <= 3000",
    "0 <= key <= 10^4",
    "0 <= value <= 10^5",
    "At most 2 * 10^5 calls will be made to get and put",
  ],
  hints: [
    "Think about what data structures allow O(1) lookup and O(1) insertion/deletion.",
    "A HashMap gives O(1) lookup. A Doubly Linked List gives O(1) insertion/deletion at any position if you have a reference to the node.",
    "Combine both: HashMap stores key -> node reference, Doubly Linked List maintains access order.",
  ],
}

const starterCode = `class LRUCache {
  private capacity: number;
  
  constructor(capacity: number) {
    this.capacity = capacity;
    // TODO: Initialize your data structures
  }

  get(key: number): number {
    // TODO: Implement get
    return -1;
  }

  put(key: number, value: number): void {
    // TODO: Implement put
  }
}
`

const sampleTestCases: TestCase[] = [
  {
    id: "1",
    name: "Test Case 1: Basic put and get",
    status: "passed",
    input: "cache.put(1, 1); cache.get(1)",
    expected: "1",
    executionTime: 2,
  },
  {
    id: "2",
    name: "Test Case 2: Capacity overflow",
    status: "failed",
    input: "cache.put(1,1); cache.put(2,2); cache.put(3,3); cache.get(1)",
    expected: "-1",
    actual: "1",
    executionTime: 3,
  },
  {
    id: "3",
    name: "Test Case 3: Update existing key",
    status: "passed",
    input: "cache.put(1, 1); cache.put(1, 10); cache.get(1)",
    expected: "10",
    executionTime: 1,
  },
  {
    id: "4",
    name: "Test Case 4: Get non-existent key",
    status: "pending",
  },
  {
    id: "5",
    name: "Test Case 5: Large capacity",
    status: "pending",
  },
]

export const NativeTrack: StoryObj = {
  render: function Render() {
    const [code, setCode] = useState(starterCode)
    const [testCases, setTestCases] = useState<TestCase[]>([])
    const [isRunning, setIsRunning] = useState(false)
    const [timeRemaining] = useState(45 * 60) // 45 minutes

    const handleRun = () => {
      setIsRunning(true)
      // Simulate test execution
      setTimeout(() => {
        setTestCases(sampleTestCases)
        setIsRunning(false)
      }, 1500)
    }

    return (
      <ChallengeArena>
        <ChallengeHeader>
          <ChallengeHeaderGroup>
            <TrackBadge track="native" />
            <ChallengeStatus status={isRunning ? "running" : "ready"} />
          </ChallengeHeaderGroup>
          <ChallengeHeaderGroup>
            <ChallengeTimer timeRemaining={timeRemaining} totalTime={45 * 60} />
          </ChallengeHeaderGroup>
        </ChallengeHeader>

        {/* Test Progress */}
        <TestProgressBar
          passed={testCases.filter((t) => t.status === "passed").length}
          failed={testCases.filter((t) => t.status === "failed").length}
          total={testCases.length || 1}
        />

        <ChallengeMain>
          {/* Problem Panel */}
          <ChallengePanel defaultSize={35}>
            <ProblemPanel {...sampleProblem} />
          </ChallengePanel>

          {/* Code Editor Panel */}
          <ChallengePanel defaultSize={40}>
            <CodeEditorPanel
              code={code}
              onChange={setCode}
              language="typescript"
            />
            <CodeEditorActions
              onRun={handleRun}
              onReset={() => setCode(starterCode)}
              isRunning={isRunning}
            />
          </ChallengePanel>

          {/* Test Results Panel */}
          <ChallengePanel defaultSize={25}>
            <TestPanel
              testCases={testCases}
              output={isRunning ? "> Executing tests..." : ""}
            />
          </ChallengePanel>
        </ChallengeMain>
      </ChallengeArena>
    )
  },
}

export const AugmentedTrack: StoryObj = {
  render: function Render() {
    const [code, setCode] = useState(starterCode)
    const [testCases] = useState<TestCase[]>(sampleTestCases)
    const [timeRemaining] = useState(60 * 60) // 60 minutes

    return (
      <ChallengeArena>
        <ChallengeHeader>
          <ChallengeHeaderGroup>
            <TrackBadge track="augmented" />
            <ChallengeStatus status="running" />
            <div className="border-border text-muted-foreground flex items-center gap-2 border-l pl-4 text-xs">
              <span className="size-1.5 rounded-full bg-amber-500" />
              AI TOOLS ENABLED
            </div>
          </ChallengeHeaderGroup>
          <ChallengeHeaderGroup>
            <div className="text-muted-foreground mr-4 text-xs">
              <span className="text-amber-500">12</span> prompts used
            </div>
            <ChallengeTimer timeRemaining={timeRemaining} totalTime={60 * 60} />
          </ChallengeHeaderGroup>
        </ChallengeHeader>

        <TestProgressBar
          passed={2}
          failed={1}
          total={5}
        />

        <ChallengeMain>
          <ChallengePanel defaultSize={35}>
            <ProblemPanel {...sampleProblem} />
          </ChallengePanel>

          <ChallengePanel defaultSize={40}>
            <CodeEditorPanel
              code={code}
              onChange={setCode}
              language="typescript"
            />
            <CodeEditorActions onRun={() => {}} />
          </ChallengePanel>

          <ChallengePanel defaultSize={25}>
            <TestPanel testCases={testCases} />
          </ChallengePanel>
        </ChallengeMain>
      </ChallengeArena>
    )
  },
}

export const TimeWarning: StoryObj = {
  render: function Render() {
    const [code] = useState(starterCode)
    const [timeRemaining] = useState(5 * 60) // 5 minutes left

    return (
      <ChallengeArena>
        <ChallengeHeader>
          <ChallengeHeaderGroup>
            <TrackBadge track="native" />
            <ChallengeStatus status="running" />
          </ChallengeHeaderGroup>
          <ChallengeHeaderGroup>
            <ChallengeTimer timeRemaining={timeRemaining} totalTime={45 * 60} />
          </ChallengeHeaderGroup>
        </ChallengeHeader>

        <TestProgressBar passed={3} failed={0} total={5} />

        <ChallengeMain>
          <ChallengePanel defaultSize={35}>
            <ProblemPanel {...sampleProblem} />
          </ChallengePanel>

          <ChallengePanel defaultSize={40}>
            <CodeEditorPanel code={code} language="typescript" readOnly />
            <CodeEditorActions onRun={() => {}} />
          </ChallengePanel>

          <ChallengePanel defaultSize={25}>
            <TestPanel testCases={sampleTestCases.slice(0, 3).map(t => ({ ...t, status: "passed" as const }))} />
          </ChallengePanel>
        </ChallengeMain>
      </ChallengeArena>
    )
  },
}

export const Completed: StoryObj = {
  render: function Render() {
    return (
      <ChallengeArena>
        <ChallengeHeader>
          <ChallengeHeaderGroup>
            <TrackBadge track="native" />
            <ChallengeStatus status="completed" />
          </ChallengeHeaderGroup>
          <ChallengeHeaderGroup>
            <div className="text-muted-foreground text-xs">
              Completed in <span className="text-green-500 font-bold">32:47</span>
            </div>
          </ChallengeHeaderGroup>
        </ChallengeHeader>

        <TestProgressBar passed={5} failed={0} total={5} />

        <ChallengeMain>
          <ChallengePanel defaultSize={35}>
            <ProblemPanel {...sampleProblem} />
          </ChallengePanel>

          <ChallengePanel defaultSize={40}>
            <CodeEditorPanel code={starterCode} language="typescript" readOnly />
          </ChallengePanel>

          <ChallengePanel defaultSize={25}>
            <TestPanel
              testCases={sampleTestCases.map((t) => ({
                ...t,
                status: "passed" as const,
              }))}
            />
          </ChallengePanel>
        </ChallengeMain>
      </ChallengeArena>
    )
  },
}
