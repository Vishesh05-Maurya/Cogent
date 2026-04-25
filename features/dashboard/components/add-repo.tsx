import { Button } from "@/components/ui/button"
import { Code, Globe } from "lucide-react"
import Link from "next/link"

const AddRepo = () => {
  return (
    <Link href="/snippets" className="block w-full">
      <div
        className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer 
        transition-all duration-300 ease-in-out transform
        hover:bg-background hover:border-[#24dc1a] hover:scale-105
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_10px_30px_rgba(233,63,63,0.15)]"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex justify-center items-center bg-white group-hover:bg-[#fff8f8] group-hover:border-[#24dc1a] group-hover:text-[#24dc1a] transition-colors duration-300"
            size={"icon"}
          >
            <Code size={30} className="transition-transform duration-300 group-hover:scale-110" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#24dc1a]">Work with Snippets</h1>
            <p className="text-sm text-white-900 max-w-[220px]">Explore, fork, and interact with community playgrounds</p>
          </div>
        </div>

        <div className="relative overflow-hidden p-4">
          <Globe
            size={80}
            className="text-muted-foreground transition-transform duration-300 group-hover:scale-110 group-hover:text-[#24dc1a] opacity-20"
          />
        </div>
      </div>
    </Link>
  )
}

export default AddRepo
