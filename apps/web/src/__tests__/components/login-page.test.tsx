import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import LoginPage from "@/app/(auth)/login/page"

// Mock the createClient function
const mockSignInWithPassword = vi.fn().mockResolvedValue({ data: null, error: null })
const mockSignInWithOAuth = vi.fn().mockResolvedValue({ data: null, error: null })

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}))

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render login form", () => {
    render(<LoginPage />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /authenticate/i })).toBeInTheDocument()
  })

  it("should render OAuth buttons", () => {
    render(<LoginPage />)
    
    expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument()
  })

  it("should render forgot password link", () => {
    render(<LoginPage />)
    
    expect(screen.getByText(/forgot/i)).toBeInTheDocument()
  })

  it("should render sign up link", () => {
    render(<LoginPage />)
    
    expect(screen.getByText(/initialize new account/i)).toBeInTheDocument()
  })

  it("should toggle password visibility", async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    const toggleButton = screen.getByText(/show/i)
    
    expect(passwordInput).toHaveAttribute("type", "password")
    
    await user.click(toggleButton)
    
    expect(passwordInput).toHaveAttribute("type", "text")
    expect(screen.getByText(/hide/i)).toBeInTheDocument()
  })

  it("should update email input", async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, "test@example.com")
    
    expect(emailInput).toHaveValue("test@example.com")
  })

  it("should update password input", async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    await user.type(passwordInput, "password123")
    
    expect(passwordInput).toHaveValue("password123")
  })

  it("should show error for invalid credentials", async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    })

    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole("button", { name: /authenticate/i })
    
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "wrongpassword")
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
  })

  it("should show loading state when submitting", async () => {
    mockSignInWithPassword.mockImplementation(() => new Promise(() => {})) // Never resolves

    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole("button", { name: /authenticate/i })
    
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/authenticating/i)).toBeInTheDocument()
    })
  })

  it("should call signInWithOAuth when clicking GitHub button", async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const githubButton = screen.getByRole("button", { name: /github/i })
    await user.click(githubButton)
    
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "github",
      options: expect.objectContaining({
        redirectTo: expect.stringContaining("/auth/callback"),
      }),
    })
  })

  it("should call signInWithOAuth when clicking Google button", async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const googleButton = screen.getByRole("button", { name: /google/i })
    await user.click(googleButton)
    
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: expect.objectContaining({
        redirectTo: expect.stringContaining("/auth/callback"),
      }),
    })
  })
})
