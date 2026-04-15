import { ErrorLayout } from "~/components/ui/ErrorLayout";

export const meta = () => {
  return [
    { title: "Not Found | EduNexus" },
    { name: "description", content: "Not Found Page" },
  ];
};

export default function NotFound() {
    return (
        <ErrorLayout 
            code="404"
            title="Lost in the Library?"
            message="We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps it never existed in the first place."
        />
    );
}