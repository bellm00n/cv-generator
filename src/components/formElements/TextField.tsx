import React, { ReactNode } from "react";
import {
  Control,
  Controller,
  ControllerProps,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  TextField as CommonTextField,
  TextFieldProps as CommonTextFieldProps,
} from "@mui/material";

type TextFieldProps<T extends FieldValues = FieldValues> = Omit<
  CommonTextFieldProps,
  "name"
> & {
  validation?: ControllerProps<T>["rules"];
  name: Path<T>;
  parseError?: (error: FieldError) => ReactNode;
  control?: Control<T>;
  /**
   * You override the MUI's TextField component by passing a reference of the component you want to use.
   *
   * This is especially useful when you want to use a customized version of TextField.
   */
  component?: typeof TextField;
};

export const TextField = <TFieldValues extends FieldValues = FieldValues>(
  props: TextFieldProps<TFieldValues>
) => {
  const { control, name, ...restProps } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <CommonTextField {...field} {...restProps} />}
    />
  );
};
