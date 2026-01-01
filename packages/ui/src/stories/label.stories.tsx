import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Label {...args} htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
  args: {
    children: "Email",
  },
}
