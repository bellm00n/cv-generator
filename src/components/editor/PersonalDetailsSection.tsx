import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";
import type { CvFormValues } from "@/schemas/formSchema";
import { WARNING_INPUT_CLASS, getWarningMessage } from "./editorUtils";

export function PersonalDetailsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CvFormValues>();

  return (
    <section className="pb-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold">Personal details</h3>
        <p className="text-xs text-app-muted">
          Contact and headline information.
        </p>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Input
          id="name"
          label="Name"
          placeholder="Alex"
          className={cn(
            getWarningMessage(errors.name?.message)
              ? WARNING_INPUT_CLASS
              : undefined,
          )}
          helperText={getWarningMessage(errors.name?.message)}
          helperTone="warning"
          {...register("name")}
        />
        <Input
          id="surname"
          label="Surname"
          placeholder="Johnson"
          className={cn(
            getWarningMessage(errors.surname?.message)
              ? WARNING_INPUT_CLASS
              : undefined,
          )}
          helperText={getWarningMessage(errors.surname?.message)}
          helperTone="warning"
          {...register("surname")}
        />
        <Input
          id="profile-title"
          label="Title"
          placeholder="Product Manager"
          className={cn(
            getWarningMessage(errors.title?.message)
              ? WARNING_INPUT_CLASS
              : undefined,
          )}
          helperText={getWarningMessage(errors.title?.message)}
          helperTone="warning"
          {...register("title")}
        />
        <Input
          id="country"
          label="Country"
          placeholder="United States"
          className={cn(
            getWarningMessage(errors.country?.message)
              ? WARNING_INPUT_CLASS
              : undefined,
          )}
          helperText={getWarningMessage(errors.country?.message)}
          helperTone="warning"
          {...register("country")}
        />
        <Input
          id="city"
          label="City"
          placeholder="San Francisco"
          className={cn(
            getWarningMessage(errors.city?.message)
              ? WARNING_INPUT_CLASS
              : undefined,
          )}
          helperText={getWarningMessage(errors.city?.message)}
          helperTone="warning"
          {...register("city")}
        />
        <Input
          id="number"
          label="Number"
          placeholder="+1 555 123 4567"
          className={cn(
            getWarningMessage(errors.phone?.message)
              ? WARNING_INPUT_CLASS
              : undefined,
          )}
          helperText={getWarningMessage(errors.phone?.message)}
          helperTone="warning"
          {...register("phone")}
        />
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="alex@example.com"
          className={cn(
            getWarningMessage(errors.email?.message)
              ? WARNING_INPUT_CLASS
              : undefined,
          )}
          helperText={getWarningMessage(errors.email?.message)}
          helperTone="warning"
          {...register("email")}
        />
      </div>
    </section>
  );
}
