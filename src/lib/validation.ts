import { z } from "zod";

// Validation constants matching database constraints
export const VALIDATION_LIMITS = {
  posts: {
    content: { max: 5000, min: 1 },
  },
  messages: {
    content: { max: 2000, min: 1 },
  },
  postComments: {
    content: { max: 2000, min: 1 },
  },
  profiles: {
    bio: { max: 500 },
    fullName: { max: 100 },
    username: { min: 3, max: 30, pattern: /^[a-zA-Z0-9_]+$/ },
  },
  notes: {
    title: { max: 200, min: 1 },
    description: { max: 1000 },
  },
  assignments: {
    title: { max: 200, min: 1 },
    description: { max: 1000 },
  },
  studyGroups: {
    name: { max: 100, min: 1 },
    description: { max: 500 },
  },
} as const;

// Zod schemas for validation
export const postSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post content cannot be empty")
    .max(VALIDATION_LIMITS.posts.content.max, `Post must be ${VALIDATION_LIMITS.posts.content.max} characters or less`),
});

export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(VALIDATION_LIMITS.messages.content.max, `Message must be ${VALIDATION_LIMITS.messages.content.max} characters or less`),
});

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(VALIDATION_LIMITS.postComments.content.max, `Comment must be ${VALIDATION_LIMITS.postComments.content.max} characters or less`),
});

export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .max(VALIDATION_LIMITS.profiles.fullName.max, `Name must be ${VALIDATION_LIMITS.profiles.fullName.max} characters or less`)
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(VALIDATION_LIMITS.profiles.bio.max, `Bio must be ${VALIDATION_LIMITS.profiles.bio.max} characters or less`)
    .optional()
    .or(z.literal("")),
  username: z
    .string()
    .trim()
    .refine(
      (val) => !val || (val.length >= VALIDATION_LIMITS.profiles.username.min && val.length <= VALIDATION_LIMITS.profiles.username.max),
      `Username must be ${VALIDATION_LIMITS.profiles.username.min}-${VALIDATION_LIMITS.profiles.username.max} characters`
    )
    .refine(
      (val) => !val || VALIDATION_LIMITS.profiles.username.pattern.test(val),
      "Username can only contain letters, numbers, and underscores"
    )
    .optional()
    .or(z.literal("")),
});

export const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(VALIDATION_LIMITS.notes.title.max, `Title must be ${VALIDATION_LIMITS.notes.title.max} characters or less`),
  description: z
    .string()
    .trim()
    .max(VALIDATION_LIMITS.notes.description.max, `Description must be ${VALIDATION_LIMITS.notes.description.max} characters or less`)
    .optional()
    .or(z.literal("")),
});

export const assignmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(VALIDATION_LIMITS.assignments.title.max, `Title must be ${VALIDATION_LIMITS.assignments.title.max} characters or less`),
  description: z
    .string()
    .trim()
    .max(VALIDATION_LIMITS.assignments.description.max, `Description must be ${VALIDATION_LIMITS.assignments.description.max} characters or less`)
    .optional()
    .or(z.literal("")),
});

export const studyGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Group name is required")
    .max(VALIDATION_LIMITS.studyGroups.name.max, `Name must be ${VALIDATION_LIMITS.studyGroups.name.max} characters or less`),
  description: z
    .string()
    .trim()
    .max(VALIDATION_LIMITS.studyGroups.description.max, `Description must be ${VALIDATION_LIMITS.studyGroups.description.max} characters or less`)
    .optional()
    .or(z.literal("")),
});

// Validation helper functions
export function validatePost(content: string): { valid: boolean; error?: string } {
  const result = postSchema.safeParse({ content });
  if (!result.success) {
    return { valid: false, error: result.error.errors[0]?.message };
  }
  return { valid: true };
}

export function validateMessage(content: string): { valid: boolean; error?: string } {
  const result = messageSchema.safeParse({ content });
  if (!result.success) {
    return { valid: false, error: result.error.errors[0]?.message };
  }
  return { valid: true };
}

export function validateProfile(data: { full_name?: string; bio?: string; username?: string }): { valid: boolean; errors?: Record<string, string> } {
  const result = profileSchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      errors[field] = err.message;
    });
    return { valid: false, errors };
  }
  return { valid: true };
}

// Get character count display
export function getCharCountDisplay(current: number, max: number): { text: string; isNearLimit: boolean; isOverLimit: boolean } {
  const remaining = max - current;
  return {
    text: `${current}/${max}`,
    isNearLimit: remaining <= max * 0.1 && remaining > 0,
    isOverLimit: remaining < 0,
  };
}
