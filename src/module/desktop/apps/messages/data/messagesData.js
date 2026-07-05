import { GITHUB_PROFILE } from "@constants";

export const INITIAL_CONVERSATIONS = [
  {
    id: "kuldeep",
    name: "Kuldeep (Developer)",
    avatar: "/images/profile.jpg",
    avatarColor: "bg-gradient-to-tr from-blue-500 to-indigo-500",
    initials: "K",
    unread: true,
    email: "kuldeeprajput.dev@gmail.com",
    github: GITHUB_PROFILE,
    messages: [
      {
        id: 1,
        text: "Hey there! Welcome to my macOS portfolio.",
        sender: "them",
        time: "10:00 AM",
      },
      {
        id: 2,
        text: "Feel free to ask me anything here. I have automated some quick replies!",
        sender: "them",
        time: "10:01 AM",
      },
      {
        id: 3,
        text: "Try asking about: 'projects', 'skills', or 'contact'.",
        sender: "them",
        time: "10:01 AM",
      },
    ],
  },
  {
    id: "john",
    name: "Akash",
    avatar: "/images/people/akash.png",
    avatarColor: "bg-gradient-to-tr from-green-400 to-teal-600",
    initials: "A",
    unread: false,
    email: "akash@example.com",
    github: "https://github.com",
    messages: [
      {
        id: 1,
        text: "Hey Kuldeep, did you check the new desktop mockup?",
        sender: "them",
        time: "Yesterday",
      },
      {
        id: 2,
        text: "Yeah, it looks super clean! The glassmorphism fits perfectly.",
        sender: "me",
        time: "Yesterday",
      },
      { id: 3, text: "Awesome! Let's get it deployed soon.", sender: "them", time: "Yesterday" },
    ],
  },
  {
    id: "apple",
    name: "Apple Support",
    avatar: "/icons/appleLogoBlack.svg",
    avatarColor: "bg-gray-100 border border-gray-250 flex items-center justify-center p-2.5",
    initials: "",
    unread: false,
    email: "developer@apple.com",
    github: "https://developer.apple.com",
    messages: [
      {
        id: 1,
        text: "Your Apple Developer Membership has been renewed.",
        sender: "them",
        time: "2 days ago",
      },
      {
        id: 2,
        text: "Thank you for being a part of the Apple Developer Program.",
        sender: "them",
        time: "2 days ago",
      },
    ],
  },
];
