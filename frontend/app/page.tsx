import React from "react";
import { ArrowRight, Star, Flame, Clock, Users } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@clerk/nextjs/server";
import { SITE_STATS, FEATURES, HOW_IT_WORKS_STEPS } from "@/lib/data";
import PricingSection from "@/components/PricingSection";
import Link from "next/link";

export default async function LandingPage() {
  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

  return (
    <div className="min-h-screen overflow-x-hidden bg-stone-50 text-stone-900">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <Badge
                variant="outline"
                className="border-2 border-orange-600 text-orange-700 bg-orange-50 text-xs sm:text-sm font-bold mb-5 sm:mb-6 uppercase tracking-wide px-3 py-1"
              >
                <Flame className="mr-1 w-4 h-4" />
                #1 AI Cooking Assistant
              </Badge>

              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-5 sm:mb-6 leading-[0.95] tracking-tight">
                Turn your{" "}
                <span className="italic underline decoration-2 sm:decoration-4 decoration-orange-600">
                  leftovers
                </span>{" "}
                into masterpieces.
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-stone-600 mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Snap a photo of your fridge. We&apos;ll tell you what to cook.
                Save money, reduce waste, and eat better tonight.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg"
                  >
                    Start Cooking Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <p className="mt-6 text-xs sm:text-sm text-stone-500">
                <span className="font-bold text-stone-900">10k+ cooks</span>{" "}
                joined last month
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative order-1 lg:order-2">
              <Card className="relative overflow-hidden border-2 border-stone-900 bg-stone-200 p-0 rounded-2xl">
                <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full">
                  <Image
                    src="/pasta-dish.png"
                    alt="Delicious pasta dish"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Floating Card */}
                <Card className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-sm border-2 border-stone-900 p-0 rounded-xl shadow-xl">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-lg leading-tight">
                          Rustic Tomato Basil Pasta
                        </h3>

                        <div className="flex gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-orange-500 text-orange-500"
                            />
                          ))}
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="border-2 border-green-700 bg-green-50 text-green-700 font-bold text-[10px] sm:text-xs whitespace-nowrap"
                      >
                        98% MATCH
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-3 sm:gap-4 text-[11px] sm:text-xs text-stone-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 25 mins
                      </span>

                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> 2 servings
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 sm:py-12 border-y-2 border-stone-900 bg-stone-900">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center px-4">
          {SITE_STATS.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl font-bold mb-1 text-stone-50">
                {stat.val}
              </div>

              <Badge
                variant="secondary"
                className="bg-transparent text-orange-500 text-xs sm:text-sm uppercase tracking-wider font-medium border-none"
              >
                {stat.label}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Your Smart Kitchen
            </h2>

            <p className="text-stone-600 text-lg sm:text-xl font-light max-w-2xl mx-auto">
              Everything you need to master your meal prep.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;

              return (
                <Card
                  key={index}
                  className="border-2 border-stone-200 bg-white hover:border-orange-600 hover:shadow-lg transition-all group p-0"
                >
                  <CardContent className="p-5 sm:p-6 lg:p-8">
                    <div className="flex justify-between items-start mb-5 sm:mb-6 gap-4">
                      <div className="border-2 border-stone-200 bg-orange-50 p-3 rounded-lg group-hover:border-orange-600 group-hover:bg-orange-100 transition-colors">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>

                      <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs font-mono bg-stone-100 text-stone-600 uppercase tracking-wide border border-stone-200 whitespace-nowrap"
                      >
                        {feature.limit}
                      </Badge>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 border-y-2 border-stone-200 bg-stone-900 text-stone-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-12 sm:mb-16 text-center lg:text-left">
            Cook in 3 Steps
          </h2>

          <div className="space-y-10 sm:space-y-12">
            {HOW_IT_WORKS_STEPS.map((item, i) => (
              <div key={i}>
                <div className="flex gap-4 sm:gap-6 items-start">
                  <Badge
                    variant="outline"
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-orange-500 border-none bg-transparent p-0 h-auto shrink-0"
                  >
                    {item.step}
                  </Badge>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3">
                      {item.title}
                    </h3>

                    <p className="text-base sm:text-lg text-stone-400 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {i < HOW_IT_WORKS_STEPS.length - 1 && (
                  <hr className="my-8 bg-stone-700 border-stone-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20 lg:py-24 px-4">
        <PricingSection subscriptionTier={subscriptionTier} />
      </section>
    </div>
  );
}


// import React from "react";
// import { ArrowRight, Star, Flame, Clock, Users } from "lucide-react";
// import Image from "next/image";
// import { SignUpButton } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { auth } from "@clerk/nextjs/server";
// import { SITE_STATS, FEATURES, HOW_IT_WORKS_STEPS } from "@/lib/data";
// import PricingSection from "@/components/PricingSection";
// import Link from "next/link";

// export default async function LandingPage() {
//   const { has } = await auth();
//   const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

//   return (
//     <div className="min-h-screen bg-stone-50 text-stone-900">
//       {/* Hero Section */}
//       <section className="pt-32 pb-20 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
//             {/* Text Content */}
//             <div className="flex-1 text-center md:text-left">
//               <Badge
//                 variant="outline"
//                 className="border-2 border-orange-600 text-orange-700 bg-orange-50 text-sm font-bold mb-6 uppercase tracking-wide"
//               >
//                 <Flame className="mr-1" />
//                 #1 AI Cooking Assistant
//               </Badge>

//               <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-[0.9] tracking-tight">
//                 Turn your{" "}
//                 <span className="italic underline decoration-4 decoration-orange-600">
//                   leftovers
//                 </span>{" "}
//                 into <br />
//                 masterpieces.
//               </h1>

//               <p className="text-xl md:text-2xl text-stone-600 mb-10 max-w-lg mx-auto md:mx-0 font-light">
//                 Snap a photo of your fridge. We&apos;ll tell you what to cook.
//                 Save money, reduce waste, and eat better tonight.
//               </p>

//               <Link href="/dashboard">
//                 <Button
//                   size="lg"
//                   variant="primary"
//                   className="px-8 py-6 text-lg"
//                 >
//                   Start Cooking Free <ArrowRight className="ml-2 w-5 h-5" />
//                 </Button>
//               </Link>

//               <p className="mt-6 text-sm text-stone-500">
//                 <span className="font-bold text-stone-900">10k+ cooks</span>{" "}
//                 joined last month
//               </p>
//             </div>

//             {/* Hero Image */}
//             <Card className="relative aspect-square md:aspect-4/5 border-2 border-stone-900 bg-stone-200 overflow-hidden py-0">
//               <Image
//                 src="/pasta-dish.png"
//                 alt="Delicious pasta dish"
//                 width={500}
//                 height={500}
//                 className="w-full h-full object-cover "
//               />

//               {/* Floating Card */}
//               <Card className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm border-2 border-stone-900 py-0">
//                 <CardContent className="p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="font-bold text-lg">
//                         Rustic Tomato Basil Pasta
//                       </h3>
//                       <div className="flex gap-0.5 mt-1">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className="w-3 h-3 fill-orange-500 text-orange-500"
//                           />
//                         ))}
//                       </div>
//                     </div>
//                     <Badge
//                       variant="outline"
//                       className="border-2 border-green-700 bg-green-50 text-green-700 font-bold"
//                     >
//                       98% MATCH
//                     </Badge>
//                   </div>
//                   <div className="flex gap-4 text-xs text-stone-500 font-medium">
//                     <span className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" /> 25 mins
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <Users className="w-3 h-3" /> 2 servings
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Stats Bar */}
//       <section className="py-12 border-y-2 border-stone-900 bg-stone-900">
//         <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
//           {SITE_STATS.map((stat, i) => (
//             <div key={i}>
//               <div className="text-4xl font-bold mb-1 text-stone-50">
//                 {stat.val}
//               </div>
//               <Badge
//                 variant="secondary"
//                 className="bg-transparent text-orange-500 text-sm uppercase tracking-wider font-medium border-none"
//               >
//                 {stat.label}
//               </Badge>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-24 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="mb-16">
//             <h2 className="text-5xl md:text-6xl font-bold mb-4 text-center">
//               Your Smart Kitchen
//             </h2>
//             <p className="text-stone-600 text-xl font-light text-center">
//               Everything you need to master your meal prep.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             {FEATURES.map((feature, index) => {
//               const IconComponent = feature.icon;
//               return (
//                 <Card
//                   key={index}
//                   className="border-2 border-stone-200 bg-white hover:border-orange-600 hover:shadow-lg transition-all group py-0"
//                 >
//                   <CardContent className="p-8">
//                     <div className="flex justify-between items-start mb-6">
//                       <div className="border-2 border-stone-200 bg-orange-50 p-3 group-hover:border-orange-600 group-hover:bg-orange-100 transition-colors">
//                         <IconComponent className="w-6 h-6" />
//                       </div>
//                       <Badge
//                         variant="secondary"
//                         className="text-xs font-mono bg-stone-100 text-stone-600 uppercase tracking-wide border border-stone-200"
//                       >
//                         {feature.limit}
//                       </Badge>
//                     </div>
//                     <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
//                     <p className="text-stone-600 text-lg font-light">
//                       {feature.description}
//                     </p>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="py-24 px-4 border-y-2 border-stone-200 bg-stone-900 text-stone-50">
//         <div className="max-w-5xl mx-auto">
//           <h2 className="text-5xl md:text-6xl font-bold mb-16">
//             Cook in 3 Steps
//           </h2>

//           <div className="space-y-12">
//             {HOW_IT_WORKS_STEPS.map((item, i) => (
//               <div key={i}>
//                 <div className="flex gap-6 items-start">
//                   <Badge
//                     variant="outline"
//                     className="text-6xl font-bold text-orange-500 border-none bg-transparent p-0 h-auto"
//                   >
//                     {item.step}
//                   </Badge>
//                   <div>
//                     <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
//                     <p className="text-lg text-stone-400 font-light">
//                       {item.desc}
//                     </p>
//                   </div>
//                 </div>
//                 {i < HOW_IT_WORKS_STEPS.length - 1 && (
//                   <hr className="my-8 bg-stone-700" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Pricing - Now Using Component */}
//       <section className="py-24 px-4">
//         <PricingSection subscriptionTier={subscriptionTier} />
//       </section>
//     </div>
//   );
// }