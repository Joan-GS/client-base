import { Link } from "@/src/components/ui/link";
import { ForgotPasswordText } from "./styles";

type Props = {
  label: string;
  href?: string;
};

export const ForgotPasswordLink = ({
  label,
  href = "/auth/forgot-password",
}: Props) => (
  <Link href={href}>
    <ForgotPasswordText>{label}</ForgotPasswordText>
  </Link>
);
