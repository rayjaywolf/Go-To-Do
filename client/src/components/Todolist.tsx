import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import TodoItem from "./TodoItem";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";

export type Todo = {
  _id: number;
  body: string;
  completed: boolean;
};

const TodoList = () => {
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      try {
        const res = await fetch(BASE_URL + "/todos");
        const contentType = res.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid content type");
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data || [];
      } catch (error) {
        console.error("Error fetching todos:", error);
        throw error;
      }
    },
  });

  if (error) {
    return (
      <Flex justifyContent={"center"} my={4}>
        <Text fontSize={"xl"} color={"red.500"}>
          Error loading tasks: {error.message}
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <Text
        fontSize={"4xl"}
        textTransform={"uppercase"}
        fontWeight={"bold"}
        textAlign={"center"}
        my={2}
        bgGradient="linear(to-r, blue, cyan)"
        bgClip="text"
      >
        Today's Tasks
      </Text>
      {isLoading && (
        <Flex justifyContent={"center"} my={4}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {!isLoading && todos?.length === 0 && (
        <Stack alignItems={"center"} gap="3">
          <Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
            All tasks completed! 🤞
          </Text>
          <img src="/go.png" alt="Go logo" width={70} height={70} />
        </Stack>
      )}
      <Stack gap={3}>
        {todos?.map((todo, idx) => <TodoItem key={idx} todo={todo} />)}
      </Stack>
    </>
  );
};
export default TodoList;
