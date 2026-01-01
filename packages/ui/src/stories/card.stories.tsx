import type { Meta, StoryObj } from "@storybook/react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description providing more context.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area where you can put anything.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="mr-2">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  ),
}

export const Small: Story = {
  args: {
    size: "sm",
  },
  render: (args) => (
    <Card {...args} className="w-[300px]">
      <CardHeader>
        <CardTitle>Small Card</CardTitle>
        <CardDescription>A more compact card layout.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Compact content fits here.</p>
      </CardContent>
    </Card>
  ),
}
