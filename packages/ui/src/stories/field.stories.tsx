import type { Meta, StoryObj } from "@storybook/react"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const meta: Meta<typeof Field> = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Field>

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="Enter your email" />
      <FieldDescription>We'll never share your email.</FieldDescription>
    </Field>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field data-invalid="true">
      <FieldLabel>Username</FieldLabel>
      <Input placeholder="Enter username" />
      <FieldError>Username is already taken.</FieldError>
    </Field>
  ),
}
