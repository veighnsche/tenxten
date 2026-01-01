import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SignUpPage from "@/app/(auth)/signup/page"

const mockSignUp = vi.fn().mockResolvedValue({ data: null, error: null })
const mockSignInWithOAuth = vi.fn().mockResolvedValue({ data: null, error: null })

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signUp: mockSignUp,
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}))

describe("Signup Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render signup form with all fields", () => {
    render(<SignUpPage />)
    
    expect(screen.getByLabelText(/callsign/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it("should show callsign with @ prefix", () => {
    render(<SignUpPage />)
    
    expect(screen.getByText("@")).toBeInTheDocument()
  })

  it("should show password strength indicator when typing password", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    await user.type(passwordInput, "weak")
    
    expect(screen.getByText(/strength:/i)).toBeInTheDocument()
  })

  it("should show WEAK for simple passwords", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    await user.type(passwordInput, "password")
    
    expect(screen.getByText(/weak/i)).toBeInTheDocument()
  })

  it("should show passwords match indicator", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/confirm password/i)
    
    await user.type(passwordInput, "Password123!")
    await user.type(confirmInput, "Password123!")
    
    expect(screen.getByText(/passwords match/i)).toBeInTheDocument()
  })

  it("should show passwords do not match error", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/confirm password/i)
    
    await user.type(passwordInput, "Password123!")
    await user.type(confirmInput, "DifferentPassword!")
    
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it("should validate callsign on blur", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)
    
    const callsignInput = screen.getByLabelText(/callsign/i)
    
    await user.type(callsignInput, "ab")
    await user.tab() // Trigger blur
    
    expect(screen.getByText(/minimum 3 characters/i)).toBeInTheDocument()
  })

  it("should show success state after successful signup", async () => {
    mockSignUp.mockResolvedValue({ error: null })

    const user = userEvent.setup()
    render(<SignUpPage />)
    
    const callsignInput = screen.getByLabelText(/callsign/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/confirm password/i)
    
    await user.type(callsignInput, "testuser")
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "Password123!")
    await user.type(confirmInput, "Password123!")
    
    // Need to trigger blur on callsign to make it valid
    await user.tab()
    
    const submitButton = screen.getByRole("button", { name: /initialize account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/verification required/i)).toBeInTheDocument()
    })
  })

  it("should show error for existing email", async () => {
    mockSignUp.mockResolvedValue({
      error: { message: "User already registered" },
    })

    const user = userEvent.setup()
    render(<SignUpPage />)
    
    const callsignInput = screen.getByLabelText(/callsign/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/confirm password/i)
    
    await user.type(callsignInput, "testuser")
    await user.tab()
    await user.type(emailInput, "existing@example.com")
    await user.type(passwordInput, "Password123!")
    await user.type(confirmInput, "Password123!")
    
    const submitButton = screen.getByRole("button", { name: /initialize account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeInTheDocument()
    })
  })

  it("should disable submit button when form is invalid", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)
    
    const submitButton = screen.getByRole("button", { name: /initialize account/i })
    
    // Initially disabled (no data)
    expect(submitButton).toBeDisabled()
    
    // Fill partial data
    const callsignInput = screen.getByLabelText(/callsign/i)
    await user.type(callsignInput, "ab") // Too short
    await user.tab()
    
    // Still disabled
    expect(submitButton).toBeDisabled()
  })

  it("should convert callsign to lowercase", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)
    
    const callsignInput = screen.getByLabelText(/callsign/i)
    await user.type(callsignInput, "TestUser")
    
    expect(callsignInput).toHaveValue("testuser")
  })

  it("should strip invalid characters from callsign", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)
    
    const callsignInput = screen.getByLabelText(/callsign/i)
    await user.type(callsignInput, "test-user@123")
    
    expect(callsignInput).toHaveValue("testuser123")
  })
})
