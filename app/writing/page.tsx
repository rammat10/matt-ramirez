import PortfolioInterface from "../portfolio-interface";

export const metadata = {
  title: "Writing | Matt Ramirez",
  description:
    "Archive channel for Matt Ramirez's writing on platforms, governance, and public questions."
};

export default function WritingPage() {
  return <PortfolioInterface initialModule="writing" />;
}
