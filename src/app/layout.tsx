import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Citizen Engagement System",
  description:
    "A platform for citizens to submit and track complaints about public services"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
