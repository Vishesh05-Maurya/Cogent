import  {Footer}  from "@/features/home/footer";
import  {Header}  from "@/features/home/header";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                {/* Background Image */}
                <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25] grayscale-[0.5] contrast-[1.1]">
                    <Image
                        src="/hero.png"
                        alt="Tech Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Background Grid */}
                <div 
                    className={cn(
                        "absolute inset-0",
                        "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]",
                        "bg-[size:40px_40px]",
                        "mask-image:[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
                    )}
                />
                
                {/* Soft Ambient Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green-500/10 dark:bg-green-500/20 blur-[120px] rounded-full" />
                <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-green-500/5 dark:bg-green-500/10 blur-[100px] rounded-full" />
                <div className="absolute top-[30%] right-[10%] w-[600px] h-[600px] bg-green-500/5 dark:bg-green-500/10 blur-[140px] rounded-full" />
            </div>
      
            <main className="z-20 relative w-full pt-0 md:pt-0  ">
          
                {children}
            </main>
            <Footer />
        </>
    );
}
