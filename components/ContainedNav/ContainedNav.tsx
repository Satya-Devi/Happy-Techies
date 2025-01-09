import { Container } from "@mantine/core";
import MainNav from "../Navbar/MainNav";
import { Navbar } from "../Navbar/Navbar";

export function ContainedNav({ role }: { role?: string }) {
  return (
    <Container fluid>
      <MainNav role={role}>
        <Navbar role={role} />
      </MainNav>
    </Container>
  );
}
