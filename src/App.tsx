import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import { RefineThemes, useNotificationProvider } from "@refinedev/antd";
import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";

import { App as AntdApp, ConfigProvider } from "antd";

import { Layout } from "@/components";
import { resources } from "@/config/resources";
import { authProvider, dataProvider, liveProvider } from "@/providers";
import {
  ConditionReportCreatePage,
  ConditionReportEditPage,
  ConditionReportListPage,
  ContactCreatePage,
  ContactEditPage,
  ContactListPage,
  DashboardPage,
  EmployeeCreatePage,
  EmployeeEditPage,
  EmployeeListPage,
  ExhibitionCreatePage,
  ExhibitionEditPage,
  ExhibitionsListPage,
  ItemCreatePage,
  ItemEditPage,
  ItemListPage,
  LandingPage,
  LoginPage,
  LoanCreatePage,
  LoanEditPage,
  LoanListPage,
  MuseumCreatePage,
  MuseumEditPage,
  MuseumListPage,
  NoMuseumPage,
  PricingPage,
  PropertyCreatePage,
  PropertyEditPage,
  PropertyListPage,
  ProfileCreatePage,
  ProfileEditPage,
  ProfileListPage,
} from "@/routes";

const App = () => {
  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          ...RefineThemes.Blue,
          token: {
            ...RefineThemes.Blue.token,
            fontFamily: '"Noto Serif", serif',
          },
        }}
      >
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              Title={() => <>MCurio | Museum CMS</>}
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              authProvider={authProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                liveMode: "auto",
                useNewQueryKeys: true,
              }}
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/pricing" element={<PricingPage />} />

                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />

                  <Route path="/items">
                    <Route index element={<ItemListPage />} />
                    <Route path="new" element={<ItemCreatePage />} />
                    <Route path="edit/:id" element={<ItemEditPage />} />
                  </Route>

                  <Route path="/contacts">
                    <Route index element={<ContactListPage />} />
                    <Route path="new" element={<ContactCreatePage />} />
                    <Route path="edit/:id" element={<ContactEditPage />} />
                  </Route>

                  <Route path="/condition-reports">
                    <Route index element={<ConditionReportListPage />} />
                    <Route path="new" element={<ConditionReportCreatePage />} />
                    <Route
                      path="edit/:id"
                      element={<ConditionReportEditPage />}
                    />
                  </Route>

                  <Route path="/loans">
                    <Route index element={<LoanListPage />} />
                    <Route path="new" element={<LoanCreatePage />} />
                    <Route path="edit/:id" element={<LoanEditPage />} />
                  </Route>

                  <Route path="/properties">
                    <Route index element={<PropertyListPage />} />
                    <Route path="new" element={<PropertyCreatePage />} />
                    <Route path="edit/:id" element={<PropertyEditPage />} />
                  </Route>

                  <Route path="/exhibitions">
                    <Route index element={<ExhibitionsListPage />} />
                    <Route path="new" element={<ExhibitionCreatePage />} />
                    <Route path="edit/:id" element={<ExhibitionEditPage />} />
                  </Route>

                  <Route path="/museums">
                    <Route index element={<MuseumListPage />} />
                    <Route path="new" element={<MuseumCreatePage />} />
                    <Route path="edit/:id" element={<MuseumEditPage />} />
                  </Route>

                  <Route path="/colleagues">
                    <Route index element={<EmployeeListPage />} />
                    <Route path="new" element={<EmployeeCreatePage />} />
                    <Route path="edit/:id" element={<EmployeeEditPage />} />
                  </Route>

                  <Route path="/profiles">
                    <Route index element={<ProfileListPage />} />
                    <Route path="new" element={<ProfileCreatePage />} />
                    <Route path="edit/:id" element={<ProfileEditPage />} />
                  </Route>

                  <Route path="*" element={<ErrorComponent />} />
                </Route>

                <Route
                  element={
                    <Authenticated
                      key="authenticated-auth"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<LoginPage />} />
                </Route>

                <Route path="/no-museum" element={<NoMuseumPage />} />
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
