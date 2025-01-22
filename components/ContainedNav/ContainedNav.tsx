import { Container } from "@mantine/core";
import MainNav from "../Navbar/MainNav";
import { Navbar } from "../Navbar/Navbar";

export function ContainedNav({ role,page }: { role?: string , page?: string}) {
  return (
    <Container fluid>
      <MainNav role={role} page={page}>
        <Navbar role={role}  page={page}/>
      </MainNav>
    </Container>
  );
}
