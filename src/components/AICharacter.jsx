import { motion } from "framer-motion";

export default function AICharacter() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full shadow-2xl cursor-pointer"
      animate={{ y: [0, -15, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      whileHover={{ scale: 1.2 }}
    >
      🤖
    </motion.div>
  );
}