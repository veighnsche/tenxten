-- Seed data for TENXTEN challenges
-- Run this after 001_initial_schema.sql

-- Native Track Challenges
INSERT INTO challenges (title, slug, domain, difficulty, track, description, constraints, hints, time_limit_seconds, starter_code) VALUES

-- Algorithms
('Implement LRU Cache', 'lru-cache', 'Algorithms', 'hard', 'native',
'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
- `LRUCache(capacity: number)` Initialize the LRU cache with positive size capacity.
- `get(key: number): number` Return the value of the key if it exists, otherwise return -1.
- `put(key: number, value: number): void` Update the value of the key if it exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity, evict the least recently used key.

The functions `get` and `put` must each run in **O(1)** average time complexity.',
ARRAY['1 <= capacity <= 3000', '0 <= key <= 10^4', '0 <= value <= 10^5', 'At most 2 * 10^5 calls will be made to get and put'],
ARRAY['Think about what data structures allow O(1) lookup and O(1) insertion/deletion.', 'A HashMap gives O(1) lookup. A Doubly Linked List gives O(1) insertion/deletion at any position if you have a reference to the node.', 'Combine both: HashMap stores key -> node reference, Doubly Linked List maintains access order.'],
2700,
'{"typescript": "class LRUCache {\n  constructor(capacity: number) {\n    // TODO\n  }\n\n  get(key: number): number {\n    // TODO\n    return -1;\n  }\n\n  put(key: number, value: number): void {\n    // TODO\n  }\n}"}'::jsonb),

('Binary Tree Maximum Path Sum', 'binary-tree-max-path', 'Algorithms', 'hard', 'native',
'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.',
ARRAY['The number of nodes in the tree is in the range [1, 3 * 10^4]', '-1000 <= Node.val <= 1000'],
ARRAY['Think about what information you need from each subtree.', 'For each node, calculate the max path that starts at that node and goes down.', 'The answer might not pass through the root - consider paths that go through any node.'],
2700,
'{"typescript": "class TreeNode {\n  val: number;\n  left: TreeNode | null;\n  right: TreeNode | null;\n  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {\n    this.val = val ?? 0;\n    this.left = left ?? null;\n    this.right = right ?? null;\n  }\n}\n\nfunction maxPathSum(root: TreeNode | null): number {\n  // TODO\n  return 0;\n}"}'::jsonb),

('Merge K Sorted Lists', 'merge-k-sorted-lists', 'Algorithms', 'medium', 'native',
'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.',
ARRAY['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4', 'lists[i] is sorted in ascending order', 'The sum of lists[i].length will not exceed 10^4'],
ARRAY['Consider using a min-heap/priority queue.', 'Divide and conquer: merge pairs of lists recursively.'],
2700,
'{"typescript": "class ListNode {\n  val: number;\n  next: ListNode | null;\n  constructor(val?: number, next?: ListNode | null) {\n    this.val = val ?? 0;\n    this.next = next ?? null;\n  }\n}\n\nfunction mergeKLists(lists: Array<ListNode | null>): ListNode | null {\n  // TODO\n  return null;\n}"}'::jsonb),

-- System Design (as code)
('Design Rate Limiter', 'rate-limiter', 'System Design', 'medium', 'native',
'Design and implement a rate limiter class that limits the number of requests a user can make within a time window.

Implement the RateLimiter class:
- `RateLimiter(maxRequests: number, windowMs: number)` Initialize with max requests allowed per window.
- `isAllowed(userId: string): boolean` Returns true if the request is allowed, false if rate limited.
- `getRemainingRequests(userId: string): number` Returns how many requests the user has left in the current window.',
ARRAY['1 <= maxRequests <= 1000', '1000 <= windowMs <= 3600000', 'userId is a non-empty string'],
ARRAY['Consider the sliding window algorithm vs fixed window.', 'Think about memory cleanup for inactive users.'],
2700,
'{"typescript": "class RateLimiter {\n  constructor(maxRequests: number, windowMs: number) {\n    // TODO\n  }\n\n  isAllowed(userId: string): boolean {\n    // TODO\n    return true;\n  }\n\n  getRemainingRequests(userId: string): number {\n    // TODO\n    return 0;\n  }\n}"}'::jsonb),

-- Debugging
('Fix the Memory Leak', 'fix-memory-leak', 'Debugging', 'medium', 'native',
'The following EventEmitter implementation has a memory leak. Identify and fix the issue.

The class should properly manage event listeners and allow cleanup when events are no longer needed.',
ARRAY['Do not change the public API', 'The fix should prevent unbounded memory growth', 'All existing tests must still pass'],
ARRAY['Look at how listeners are stored and removed.', 'Consider what happens when the same listener is added multiple times.'],
1800,
'{"typescript": "class EventEmitter {\n  private events: Map<string, Function[]> = new Map();\n\n  on(event: string, listener: Function): void {\n    if (!this.events.has(event)) {\n      this.events.set(event, []);\n    }\n    this.events.get(event)!.push(listener);\n  }\n\n  off(event: string, listener: Function): void {\n    // BUG: This does not properly remove the listener\n    const listeners = this.events.get(event);\n    if (listeners) {\n      listeners.filter(l => l !== listener);\n    }\n  }\n\n  emit(event: string, ...args: any[]): void {\n    const listeners = this.events.get(event);\n    if (listeners) {\n      listeners.forEach(l => l(...args));\n    }\n  }\n}"}'::jsonb);

-- Augmented Track Challenges
INSERT INTO challenges (title, slug, domain, difficulty, track, description, constraints, hints, time_limit_seconds, starter_code) VALUES

('Build Real-time Markdown Editor', 'realtime-markdown-editor', 'Speed Build', 'medium', 'augmented',
'Build a real-time collaborative markdown editor component.

Requirements:
- Split view: markdown input on left, rendered preview on right
- Real-time preview updates as user types
- Support for basic markdown: headings, bold, italic, code blocks, links, lists
- Character count display
- Copy rendered HTML button

You may use any libraries. Speed and code quality both matter.',
ARRAY['Must be a single React component', 'Must handle edge cases gracefully', 'Must be accessible'],
ARRAY['Consider using a markdown parsing library like marked or remark.', 'Debounce the preview updates for performance.'],
3600,
'{"typescript": "export default function MarkdownEditor() {\n  // Build your editor here\n  return (\n    <div>\n      {/* TODO */}\n    </div>\n  );\n}"}'::jsonb),

('Implement Drag & Drop Kanban', 'kanban-board', 'Speed Build', 'hard', 'augmented',
'Build a Kanban board with drag-and-drop functionality.

Requirements:
- Three columns: Todo, In Progress, Done
- Cards can be dragged between columns
- Cards can be reordered within columns
- Add new card button for each column
- Delete card functionality
- Persist state to localStorage

You may use any libraries. Speed and code quality both matter.',
ARRAY['Must handle edge cases (empty columns, etc)', 'Must be keyboard accessible', 'State must persist across page reloads'],
ARRAY['Consider using @dnd-kit or react-beautiful-dnd.', 'Use useReducer for complex state management.'],
3600,
'{"typescript": "export default function KanbanBoard() {\n  // Build your kanban board here\n  return (\n    <div>\n      {/* TODO */}\n    </div>\n  );\n}"}'::jsonb),

('Optimize This Prompt', 'prompt-optimization', 'Prompt Engineering', 'easy', 'augmented',
'You are given a poorly written prompt that produces inconsistent results. Your task is to rewrite it to be more effective.

Original prompt:
"Write some code that does sorting"

Requirements:
- Make the prompt specific and unambiguous
- Include constraints and expected output format
- Add examples if helpful
- The optimized prompt should consistently produce a working quicksort implementation in TypeScript

Submit your optimized prompt as a string.',
ARRAY['Prompt must be under 500 characters', 'Must work with GPT-4 or Claude', 'Must consistently produce correct quicksort'],
ARRAY['Be specific about the programming language and algorithm.', 'Specify the function signature and types.'],
1800,
'{"typescript": "const optimizedPrompt = `\n  // Write your optimized prompt here\n`;\n\nexport default optimizedPrompt;"}'::jsonb),

('Build AI Chat Interface', 'ai-chat-interface', 'AI Integration', 'medium', 'augmented',
'Build a chat interface that connects to an AI API.

Requirements:
- Message input with send button
- Display conversation history
- Show loading state while waiting for response
- Handle errors gracefully
- Support markdown in AI responses
- Auto-scroll to latest message

You may use any libraries and AI APIs (OpenAI, Anthropic, etc). Mock the API if needed.',
ARRAY['Must handle API errors gracefully', 'Must show loading states', 'Must be mobile responsive'],
ARRAY['Use streaming responses for better UX if the API supports it.', 'Consider using react-markdown for rendering.'],
3600,
'{"typescript": "export default function ChatInterface() {\n  // Build your chat interface here\n  return (\n    <div>\n      {/* TODO */}\n    </div>\n  );\n}"}'::jsonb);

-- Add test cases for LRU Cache
INSERT INTO challenge_test_cases (challenge_id, input, expected_output, is_hidden, "order") 
SELECT id, 
  '{"operations": ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], "args": [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]}',
  '[null, null, null, 1, null, -1, null, -1, 3, 4]',
  false, 1
FROM challenges WHERE slug = 'lru-cache';

INSERT INTO challenge_test_cases (challenge_id, input, expected_output, is_hidden, "order")
SELECT id,
  '{"operations": ["LRUCache", "put", "get"], "args": [[1], [1, 1], [1]]}',
  '[null, null, 1]',
  false, 2
FROM challenges WHERE slug = 'lru-cache';

INSERT INTO challenge_test_cases (challenge_id, input, expected_output, is_hidden, "order")
SELECT id,
  '{"operations": ["LRUCache", "put", "put", "put", "get"], "args": [[2], [1, 1], [2, 2], [3, 3], [1]]}',
  '[null, null, null, null, -1]',
  true, 3
FROM challenges WHERE slug = 'lru-cache';

-- Add examples for LRU Cache
INSERT INTO challenge_examples (challenge_id, input, output, explanation, "order")
SELECT id,
  'LRUCache cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);    // returns 1
cache.put(3, 3); // evicts key 2
cache.get(2);    // returns -1 (not found)',
  '[null, null, null, 1, null, -1]',
  'After putting keys 1 and 2, getting key 1 makes it recently used. When putting key 3, key 2 is evicted as it was least recently used.',
  1
FROM challenges WHERE slug = 'lru-cache';
