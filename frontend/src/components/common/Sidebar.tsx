"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Building,
  ChevronDown,
  CreditCard,
  HelpCircle,
  Info,
  MessageSquare,
  Server,
  Settings,
  Shield,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sidebarItems = [
  { label: "Organisation", icon: Building, href: "#" },
  { label: "Accès", icon: Shield, href: "#" },
  { label: "Services", icon: Server, href: "/services" },
  { label: "Agents IA", icon: Bot, href: "/agentia" },
  { label: "Équipes", icon: Users, href: "#" },
  { label: "Informations", icon: Info, href: "#" },
  { label: "Paramètres", icon: Settings, href: "#" },
];

const bottomSidebarItems = [
  { label: "Comptabilité", icon: CreditCard },
  { label: "Transactions", icon: CreditCard },
  { label: "Clients", icon: Users },
  { label: "Fournisseurs", icon: Wrench },
];

const supportItems = [
  { label: "Contacts", icon: MessageSquare },
  { label: "Tickets", icon: HelpCircle },
  { label: "Centre support", icon: HelpCircle },
  { label: "Conversations", icon: MessageSquare },
];

export default function Sidebar() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">Demo ESGI</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {sidebarItems.map((item, index) => {
              const content = (
                <div className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              );
              return (
                item.href && (
                  <Link href={item.href} key={index}>
                    {content}
                  </Link>
                )
              );
            })}
          </div>

          <Separator className="my-4" />

          <div className="p-2">
            {bottomSidebarItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="p-2">
            {supportItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Support</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Changelog</span>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Jean</div>
              <div className="text-xs text-gray-500">jean@example.com</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
