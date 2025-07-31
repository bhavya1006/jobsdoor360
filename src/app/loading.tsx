import { Jd360Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Jd360Loader className="h-20 w-auto text-primary" />
    </div>
  );
}
