import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function MarksLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
    return (
        <section className="relative min-h-screen">
          {children}   {/* The main page or listing */}
          {modal}      {/* The modal route content */}
        </section>
      );
}
