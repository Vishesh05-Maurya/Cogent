"use client";
import TemplateSelectionModal from "@/components/modal/template-selector-modal";
import { Button } from "@/components/ui/button"
import { createPlayground } from "@/features/playground/actions";
import { Plus } from 'lucide-react'
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    template: "PYTHON" | "JAVA" | "C" | "CPP" | "JAVASCRIPT" | "GO" | "RUST";
    description?: string;
  } | null>(null)
  const router = useRouter()

  const handleSubmit = async(data: {
    title: string;
    template: "PYTHON" | "JAVA" | "C" | "CPP" | "JAVASCRIPT" | "GO" | "RUST";
    description?: string;
  }) => {
    setSelectedTemplate(data)
    try {
      const res = await createPlayground(data);
      if (res?.id) {
        toast.success("Playground created successfully");
        setIsModalOpen(false);
        router.push(`/playground/${res.id}`);
      } else {
        throw new Error("Failed to get playground ID from server");
      }
    } catch (error) {
      console.error("Failed to create playground:", error);
      toast.error("Failed to create playground. Please check your connection.");
    }
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer 
        transition-all duration-300 ease-in-out transform
        hover:bg-background hover:border-[#30db1d] hover:scale-105
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_10px_30px_rgba(48,219,29,0.15)]"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex justify-center items-center bg-white group-hover:bg-[#fff8f8] group-hover:border-[#1bde22] group-hover:text-[#1cde1c] transition-colors duration-300"
            size={"icon"}
          >
            <Plus size={30} className="transition-transform duration-300 group-hover:rotate-90" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#1ac522]">Add New</h1>
            <p className="text-sm text-white-900 max-w-[220px]">Create a new playground</p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={"/add-new.svg"}
            alt="Create new playground"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
      
      <TemplateSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddNewButton
