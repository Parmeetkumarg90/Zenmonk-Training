import { Input, Box, Button, List, Alert, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TaskStatus, type taskInterface, type errorInterface } from "./interfaces/interfaces";
import { LuCircleCheck, LuCircleDashed } from "react-icons/lu";
import React from "react";

function App() {
  const [tasks, setTasks] = useState<taskInterface[] | null>(null);
  const [currTask, setCurrTask] = useState<string>("");
  const [isError, setError] = useState<boolean>(false);
  const [isDeletionView, setDeletionView] = useState<boolean>(false);
  const [errorDetail, setErrorDetail] = useState<errorInterface | null>(null)

  useEffect(() => {
    getFromLocalStorage();
  }, []);

  function handleAddTask(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == 'Enter') {
      addTask();
    }
  }

  function getFromLocalStorage() {
    const isTaskAvailable = localStorage.getItem("allTask");
    if (isTaskAvailable) {
      const parsetask = JSON.parse(isTaskAvailable);
      setTasks(parsetask);
    }
  }

  function setToLocalStorage(allTasks: taskInterface[] | []) {
    localStorage.setItem("allTask", JSON.stringify(allTasks));
  }

  function addTask() {
    if (currTask.trim() !== "") {
      setTasks(prev => {
        const newTasks = prev ? [...prev] : [];
        if (currTask) {
          newTasks.unshift({ id: Date.now() + currTask, name: currTask, status: TaskStatus.Pending });
          setCurrTask("");
        }
        setToLocalStorage(newTasks);
        return newTasks;
      });
    }
  }

  function markPending(id: string) {
    setTasks((prev) => {
      const result = prev ? prev?.map((each) => {
        if (id == each.id) {
          each.status = TaskStatus.Pending;
        }
        return each;
      }) : [];
      setToLocalStorage(result);
      return result;
    });
  }

  function markCompleted(id: string) {
    setTasks((prev) => {
      const result = prev ? prev.map((each) => {
        if (id == each.id) {
          each.status = TaskStatus.Completed;
        }
        return each;
      }) : [];
      setToLocalStorage(result);
      return result;
    });
  }

  function handleDeleteTask(id: string) {
    const result = tasks ? tasks.map((each) => {
      if (id == each.id) {
        if (each.status === "pending") {
          showError("Invalid Deletion", "Not allowed to delete pending task");
        }
        else {
          each.status = TaskStatus.Deleted;
        }
      }
      return each;
    }) : [];
    setToLocalStorage(result);
    setTasks(result);
  }

  function handleRestoreTask(id: string) {
    const result = tasks ? tasks.map((each) => {
      if (id == each.id) {
        if (each.status !== "deleted") {
          showError("Invalid Restore", "Not allowed to restore task that is not deleted");
        }
        else {
          each.status = TaskStatus.Pending;
        }
      }
      return each;
    }) : [];
    setToLocalStorage(result);
    setTasks(result);
  }

  function showError(title: string, description: string) {
    setError(true);
    const errObj = { title: title, description: description };
    setErrorDetail(errObj);
    let timer = setInterval(() => {
      setError(false);
      clearInterval(timer);
      setErrorDetail(null);
    }, 2000);
  }

  return (
    <>
      <Box width={"full"} justifyContent={"center"} alignItems={"center"} display={"flex"} flexDirection={"column"}>
        <Box p="2" w={"full"} fontSize={"2xl"} textAlign={"center"} borderWidth="2px" borderColor="border.disabled" color="fg.disabled">To Do App</Box>
        <Box width="1/2" justifyContent={"center"} alignItems={"center"} display={"flex"} flexDirection={"row"} marginY={"5"} >
          <Input placeholder="Enter task here"
            value={currTask}
            onChange={(e) => { setCurrTask(e.target.value); }}
            onKeyDown={handleAddTask}
            pl="3"
            mt="5"
            mr={"3"}
            name="taskField"
            id="taskField"
          />
          <Button variant={"outline"} background={"black"} color={"white"} onClick={() => { addTask(); }} px="3" mt="5" mr={"3"}>Add Task</Button>
        </Box>
        <Button variant={"outline"} background={"black"} color={"white"} onClick={() => { setDeletionView(!isDeletionView); }} px="3" my="5" mr={"3"}>{isDeletionView ? "View All Task" : "View Deleted Task"}</Button>
        {isError && errorDetail &&
          <Alert.Root status="error" position={"relative"} bottom={0} width={"1/2"} margin={"auto"} textAlign={"center"} borderRadius={"full"} color={"white"} alignContent={"center"} background={"red.700"}>
            {/* <Alert.Indicator /> */}
            <Alert.Content>
              <Alert.Title>{errorDetail.title}</Alert.Title>
              <Alert.Description>
                {errorDetail.description}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        }
        <Box width="1/2" display={"flex"} flexDirection={"column"} mt={"5"}>
          <List.Root gap="2" variant="plain" align="center" height={"35vw"} overflowY={"auto"}>
            {!isDeletionView &&
              tasks?.map((task) => {
                return task.status != "deleted" ? (
                  <List.Item key={task.id} width="full" fontSize={"2xl"} border={'1px solid'} marginY={"2"} borderRadius={"full"} paddingX={"5"} paddingY={"2"} borderColor={"white"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                    <List.Indicator asChild color="green.500" marginRight={"2"}>
                      {task.status === "completed" ? <LuCircleCheck onClick={() => { markPending(task.id); }} /> : <LuCircleDashed onClick={() => { markCompleted(task.id); }} />}
                    </List.Indicator>
                    {task.name}
                    <Button variant={"outline"} background={"black"} color={"white"} px="3" mr={"3"} onClick={() => { handleDeleteTask(task.id); }}>Delete</Button>
                  </List.Item>
                )
                  : (<React.Fragment key={task.id}></React.Fragment>)
              })
            }
            {isDeletionView &&
              tasks?.map((task) => {
                return task.status == "deleted" ? (
                  <List.Item key={task.id} width="full" fontSize={"2xl"} border={'1px solid'} marginY={"2"} borderRadius={"full"} paddingX={"5"} paddingY={"2"} borderColor={"white"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                    {task.name}
                    <Button variant={"outline"} background={"black"} color={"white"} px="3" mr={"3"} onClick={() => { handleRestoreTask(task.id); }}>Restore Task</Button>
                  </List.Item>
                )
                  : (<React.Fragment key={task.id}></React.Fragment>)
              })
            }
          </List.Root>
        </Box>
      </Box >
    </>
  )
}


export default App
