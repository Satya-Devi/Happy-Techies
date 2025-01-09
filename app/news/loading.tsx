import { Center, Loader } from "@mantine/core";

export default function Loading() {
  return (
    <Center style={{ height: "100vh" }}>
      <Loader color="gray" size="lg" type="dots" />
    </Center>
  );
}
