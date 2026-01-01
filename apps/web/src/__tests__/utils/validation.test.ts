import { describe, it, expect } from "vitest"

// Validation functions (extracted from signup page for testing)
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: "WEAK", color: "bg-red-500" }
  if (score <= 2) return { score, label: "FAIR", color: "bg-amber-500" }
  if (score <= 3) return { score, label: "GOOD", color: "bg-yellow-500" }
  if (score <= 4) return { score, label: "STRONG", color: "bg-signal-orange" }
  return { score, label: "EXCELLENT", color: "bg-signal-orange/80" }
}

function validateCallsign(callsign: string): { valid: boolean; error?: string } {
  if (callsign.length < 3) return { valid: false, error: "Minimum 3 characters" }
  if (callsign.length > 20) return { valid: false, error: "Maximum 20 characters" }
  if (!/^[a-z0-9_]+$/.test(callsign)) return { valid: false, error: "Only lowercase letters, numbers, underscores" }
  if (/^[0-9]/.test(callsign)) return { valid: false, error: "Cannot start with a number" }
  if (/^_|_$/.test(callsign)) return { valid: false, error: "Cannot start or end with underscore" }
  return { valid: true }
}

describe("Password Strength", () => {
  it("should return WEAK for short passwords", () => {
    expect(getPasswordStrength("abc").label).toBe("WEAK")
    expect(getPasswordStrength("1234567").label).toBe("WEAK")
  })

  it("should have low scores for simple passwords", () => {
    // Simple lowercase 8-char = 1 point (length)
    expect(getPasswordStrength("abcdefgh").score).toBeLessThanOrEqual(2)
    // Numbers only 8-char = 1-2 points (length + digit)
    expect(getPasswordStrength("12345678").score).toBeLessThanOrEqual(2)
  })

  it("should return FAIR for 8+ chars with mixed case", () => {
    expect(getPasswordStrength("Password").label).toBe("FAIR")
  })

  it("should return GOOD for 8+ chars with mixed case and numbers", () => {
    expect(getPasswordStrength("Password1").label).toBe("GOOD")
  })

  it("should return STRONG for complex passwords", () => {
    expect(getPasswordStrength("Password1!").label).toBe("STRONG")
  })

  it("should return EXCELLENT for long complex passwords", () => {
    expect(getPasswordStrength("MyPassword123!").label).toBe("EXCELLENT")
  })

  it("should increment score correctly", () => {
    // Empty password = 0
    expect(getPasswordStrength("").score).toBe(0)
    
    // 8+ chars = 1
    expect(getPasswordStrength("abcdefgh").score).toBe(1)
    
    // 12+ chars = 2
    expect(getPasswordStrength("abcdefghijkl").score).toBe(2)
    
    // Mixed case adds 1
    expect(getPasswordStrength("Abcdefghijkl").score).toBe(3)
    
    // Number adds 1
    expect(getPasswordStrength("Abcdefghijk1").score).toBe(4)
    
    // Special char adds 1
    expect(getPasswordStrength("Abcdefghij1!").score).toBe(5)
  })
})

describe("Callsign Validation", () => {
  describe("length validation", () => {
    it("should reject callsigns shorter than 3 characters", () => {
      expect(validateCallsign("ab")).toEqual({ valid: false, error: "Minimum 3 characters" })
      expect(validateCallsign("a")).toEqual({ valid: false, error: "Minimum 3 characters" })
      expect(validateCallsign("")).toEqual({ valid: false, error: "Minimum 3 characters" })
    })

    it("should reject callsigns longer than 20 characters", () => {
      const longCallsign = "a".repeat(21)
      expect(validateCallsign(longCallsign)).toEqual({ valid: false, error: "Maximum 20 characters" })
    })

    it("should accept callsigns between 3 and 20 characters", () => {
      expect(validateCallsign("abc").valid).toBe(true)
      expect(validateCallsign("a".repeat(20)).valid).toBe(true)
    })
  })

  describe("character validation", () => {
    it("should accept lowercase letters", () => {
      expect(validateCallsign("testuser").valid).toBe(true)
    })

    it("should accept numbers (not at start)", () => {
      expect(validateCallsign("user123").valid).toBe(true)
    })

    it("should accept underscores (not at start or end)", () => {
      expect(validateCallsign("test_user").valid).toBe(true)
    })

    it("should reject uppercase letters", () => {
      expect(validateCallsign("TestUser")).toEqual({ 
        valid: false, 
        error: "Only lowercase letters, numbers, underscores" 
      })
    })

    it("should reject special characters", () => {
      expect(validateCallsign("test-user")).toEqual({ 
        valid: false, 
        error: "Only lowercase letters, numbers, underscores" 
      })
      expect(validateCallsign("test.user")).toEqual({ 
        valid: false, 
        error: "Only lowercase letters, numbers, underscores" 
      })
      expect(validateCallsign("test@user")).toEqual({ 
        valid: false, 
        error: "Only lowercase letters, numbers, underscores" 
      })
    })

    it("should reject spaces", () => {
      expect(validateCallsign("test user")).toEqual({ 
        valid: false, 
        error: "Only lowercase letters, numbers, underscores" 
      })
    })
  })

  describe("position validation", () => {
    it("should reject callsigns starting with a number", () => {
      expect(validateCallsign("123user")).toEqual({ 
        valid: false, 
        error: "Cannot start with a number" 
      })
      expect(validateCallsign("1abc")).toEqual({ 
        valid: false, 
        error: "Cannot start with a number" 
      })
    })

    it("should reject callsigns starting with underscore", () => {
      expect(validateCallsign("_testuser")).toEqual({ 
        valid: false, 
        error: "Cannot start or end with underscore" 
      })
    })

    it("should reject callsigns ending with underscore", () => {
      expect(validateCallsign("testuser_")).toEqual({ 
        valid: false, 
        error: "Cannot start or end with underscore" 
      })
    })
  })

  describe("valid callsigns", () => {
    it("should accept valid callsigns", () => {
      expect(validateCallsign("john_doe").valid).toBe(true)
      expect(validateCallsign("coder2024").valid).toBe(true)
      expect(validateCallsign("the_10x_dev").valid).toBe(true)
      expect(validateCallsign("abc").valid).toBe(true)
    })
  })
})
