import { createClient } from "@/utils/supabase/server";
import {
  Button,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Text,
  Image,
} from "@mantine/core";
import Link from "next/link";
import { redirect } from "next/navigation";
import classes from "./Navbar.module.css";
import {
  IconBookmark,
  IconBookmarks,
  IconBrandWindows,
  IconEye,
  IconNews,
  IconNotebook,
  IconSearch,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

export async function Navbar({ role, page }: { role?: string; page?: string }) {
  const supabase = createClient();
  let emp_user = null;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User data", user);
  if (role == "Employer") {
    if (user?.id) {
      const { data: empData, error: empError } = await supabase
        .from("employer_details")
        .select("*")
        .eq("id", user?.id);

      console.log("SatyaDevi==========", empData);
      if (empError) {
        console.error("Error fetching user:", empError);
        return;
      }
      if (empData && empData.length > 0 && empData[0].is_employer_login) {
        emp_user = true;
      }
    }
  }

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };
  const empsignOut = async () => {
    "use server";

    const supabase = createClient();
    const { data: updateData, error: updateError } = await supabase
      .from("employer_details")
      .update({
        is_employer_login: false,
      })
      .eq("id", user?.id);
    await supabase.auth.signOut();

    return redirect("/employers-login");
  };

  const employerMenuItems = [
    {
      path: "/overview",
      label: "Overview",
      id: "overview",
    },
    {
      path: "/post-job",
      label: "Post a Job",
      id: "post-job",
    },
    {
      path: "/my-jobs",
      label: "My Jobs",
      id: "my-jobs",
    },

    {
      path: emp_user ? "/employers-logout" : "/employers-login",
      label: emp_user ? "Logout" : "Login",
      id: emp_user ? "logout" : "login",
    },
  ];

  return role == "Employer" ? (
    <>
      <Link href="/" style={{ textDecoration: "none", cursor: "pointer" }}>
        <Image
          src="/images/logo.png"
          alt="logo"
          width={100}
          height="auto"
          className={classes.logo}
        />
      </Link>

      <Group align="center" h="100%" visibleFrom="sm" gap={10}>
        {employerMenuItems.map((item) => (
          <Menu key={item.id} trigger="hover" openDelay={100} closeDelay={400}>
            <MenuTarget>
              {item.id !== "logout" ? (
                <Link href={item.path} style={{ textDecoration: "none" }}>
                  <Text
                    className={classes.link}
                    style={{
                      cursor: "pointer",
                      fontWeight: 600,
                      borderRadius: page && page === item.id ? "6px" : "",
                      padding: page && page === item.id ? "6px 23px" : "",
                      color: page && page === item.id ? "white" : "#004a93",
                      backgroundColor:
                        page && page === item.id ? "#004A93" : "",
                    }}
                  >
                    {item.label}
                  </Text>
                </Link>
              ) : (
                <form action={empsignOut}>
                  <Button
                    type="submit"
                    radius="md"
                    size="md"
                    variant="subtle"
                    color="#004a93"
                  >
                    Logout
                  </Button>
                </form>
              )}
            </MenuTarget>
          </Menu>
        ))}
      </Group>
      {/* {user ? (
          <form action={empsignOut}>
            <Button
              type="submit"
              radius="md"
              size="md"
              variant="subtle"
              color="#004a93"
              style={{border:"1px solid #004A93"}}
            >
              Logout
            </Button>
          </form>
        ) : (
          <Button
            component="a"
            href="/employers-login"
            radius="md"
            size="md"
            variant="subtle"
           color="#004a93"
           style={{border:"1px solid #004A93"}}
          >
            Login
          </Button>
        )} */}
    </>
  ) : (
    <>
      <Link href="/" style={{ textDecoration: "none", cursor: "pointer" }}>
        <Image
          src="/images/logo.png"
          alt="logo"
          width={100}
          height={"auto"}
          className={classes.logo}
        />
      </Link>

      <Group align="center" h="100%" visibleFrom="sm">
        <Menu trigger="hover" openDelay={100} closeDelay={400}>
          <MenuTarget>
            <Text className={classes.link} style={{ cursor: "pointer" }}>
              Insights
            </Text>
          </MenuTarget>
          <MenuDropdown ml={`90px`} className={classes.menuDropdown}>
            <MenuItem className={classes.MenuItem}>
              <Link href="/news" style={{ textDecoration: "none" }} title="Microsoft Tech News">
                <div className={classes.menuItemContent}>
                  <div className={classes.iconWrapper}>
                    <IconNews size={24} className={classes.icon} />
                  </div>
                  <div className={classes.textContent}>
                    <Text className={classes.title}>News</Text>
                    <Text className={classes.description}>
                      Stay up to date on what's happening in the Microsoft
                      ecosystem
                    </Text>
                    <Text className={classes.learnMore}>Learn more</Text>
                  </div>
                </div>
              </Link>
            </MenuItem>
            <MenuItem className={classes.MenuItem}>
              <Link href="/perspectives" style={{ textDecoration: "none" }} title="Career Insights and Microsoft Tech Trends">
                <div className={classes.menuItemContent}>
                  <div className={classes.iconWrapper}>
                    <IconEye size={24} className={classes.icon} />
                  </div>
                  <div className={classes.textContent}>
                    <Text className={classes.title}>Perspectives</Text>
                    <Text className={classes.description}>
                      Read articles and blogs by experienced professionals
                    </Text>
                    <Text className={classes.learnMore}>Learn more</Text>
                  </div>
                </div>
              </Link>
            </MenuItem>
            <MenuItem className={classes.MenuItem}>
              <Link href="/partners" style={{ textDecoration: "none" }} title="Explore Microsoft Partners">
                <div className={classes.menuItemContent}>
                  <div className={classes.iconWrapper}>
                    <IconBrandWindows size={24} className={classes.icon} />
                  </div>
                  <div className={classes.textContent}>
                    <Text className={classes.title}>Microsoft Partners</Text>
                    <Text className={classes.description}>
                      Get to know about consulting companies in the Microsoft
                      ecosystem
                    </Text>
                    <Text className={classes.learnMore}>Learn more</Text>
                  </div>
                </div>
              </Link>
            </MenuItem>
          </MenuDropdown>
        </Menu>

        <Menu trigger="hover" openDelay={100} closeDelay={400}>
          <MenuTarget>
            <Text className={classes.link} style={{ cursor: "pointer" }}>
              Learn
            </Text>
          </MenuTarget>
          <MenuDropdown ml={`2px`} className={classes.menuDropdown}>
            <MenuItem className={classes.MenuItem}>
              <Link href="/roles" style={{ textDecoration: "none" }} title="Explore Career Paths and Certifications">
                <div className={classes.menuItemContent}>
                  <div className={classes.iconWrapper}>
                    <IconUsers size={24} className={classes.icon} />
                  </div>
                  <div className={classes.textContent}>
                    <Text className={classes.title}>Roles</Text>
                    <Text className={classes.description}>
                      Everything you need to know about different job roles in
                      the Microsoft ecosystem
                    </Text>
                    <Text className={classes.learnMore}>Learn more</Text>
                  </div>
                </div>
              </Link>
            </MenuItem>
            <MenuItem className={classes.MenuItem}>
              <Link href="/career-services" style={{ textDecoration: "none" }} title="Grow Your Career with HappyTechies">
                <div className={classes.menuItemContent}>
                  <div className={classes.iconWrapper}>
                    <IconNotebook size={24} className={classes.icon} />
                  </div>
                  <div className={classes.textContent}>
                    <Text className={classes.title}>Resources</Text>
                    <Text className={classes.description}>
                      Directory of the free and paid resources to help you grow
                      professionally
                    </Text>
                    <Text className={classes.learnMore}>Learn more</Text>
                  </div>
                </div>
              </Link>
            </MenuItem>
          </MenuDropdown>
        </Menu>

        <Menu trigger="hover" openDelay={100} closeDelay={400}>
          <MenuTarget>
            <Text className={classes.link} style={{ cursor: "pointer" }}>
              Jobs
            </Text>
          </MenuTarget>
          <MenuDropdown
            ml={`-10px`}
            w={`465px`}
            className={classes.menuDropdown}
          >
            <MenuItem className={classes.MenuItem}>
              <Link href="/jobs" style={{ textDecoration: "none" }} title="Microsoft Tech Job Listings">
                <div className={classes.menuItemContent}>
                  <div className={classes.iconWrapper}>
                    <IconSearch size={24} className={classes.icon} />
                  </div>
                  <div className={classes.textContent}>
                    <Text className={classes.title}>Job Search</Text>
                    <Text className={classes.description}>
                      Quickly find the latest and the most relevant jobs
                    </Text>
                    <Text className={classes.learnMore}>Learn more</Text>
                  </div>
                </div>
              </Link>
            </MenuItem>
            <MenuItem className={classes.MenuItem}>
              <Link href="/tracker" style={{ textDecoration: "none" }} title="Your Saved Microsoft Career Opportunities">
                <div className={classes.menuItemContent}>
                  <div className={classes.iconWrapper}>
                    <IconBookmarks size={24} className={classes.icon} />
                  </div>
                  <div className={classes.textContent}>
                    <Text className={classes.title}>My Jobs</Text>
                    <Text className={classes.description}>
                      View all the jobs you have saved
                    </Text>
                    <Text className={classes.learnMore}>Learn more</Text>
                  </div>
                </div>
              </Link>
            </MenuItem>
          </MenuDropdown>
        </Menu>

        {user ? (
          <form action={signOut}>
            <Button
              type="submit"
              radius="md"
              size="md"
              variant="filled"
              color="#004a93"
            >
              Logout
            </Button>
          </form>
        ) : (
          <Button
            component="a"
            href="/login"
            radius="md"
            size="md"
            variant="filled"
            color="#004a93"
          >
            Login
          </Button>
        )}
        <Button
          component="a"
          href="/overview"
          radius="md"
          size="md"
          variant="filled"
          color="blue"
        >
          Employers
        </Button>
      </Group>
    </>
  );
}
