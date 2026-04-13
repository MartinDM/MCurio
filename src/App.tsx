import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import { RefineThemes, useNotificationProvider } from "@refinedev/antd";
import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";

import { App as AntdApp, ConfigProvider } from "antd";

import {
  CookieBanner,
  Layout,
  CustomDocumentTitleHandler,
  PlanRestrictedRoute,
} from "@/components";
import { DynamicResourceProvider } from "@/components/DynamicResourceProvider";
import { AuthenticationWrapper } from "@/components/AuthenticationWrapper";
import { resources } from "@/config/resources";
import { authProvider, dataProvider, liveProvider } from "@/providers";
import {
  ConditionReportCreatePage,
  ConditionReportEditPage,
  ConditionReportListPage,
  ContactCreatePage,
  ContactEditPage,
  ContactListPage,
  ContactDetailPage,
  LocationCreatePage,
  LocationEditPage,
  LocationListPage,
  DashboardPage,
  CmsEnginePage,
  EmployeeCreatePage,
  EmployeeEditPage,
  EmployeeListPage,
  EthicsAndProvenancePage,
  ExhibitionCreatePage,
  ExhibitionEditPage,
  ExhibitionsListPage,
  ItemCreatePage,
  ItemEditPage,
  ItemListPage,
  LandingPage,
  LoginPage,
  SignupPage,
  LoanCreatePage,
  LoanEditPage,
  LoanListPage,
  MuseumCreatePage,
  MuseumEditPage,
  MuseumListPage,
  NoMuseumPage,
  OnboardingFlow,
  PhilosophyPage,
  PricingPage,
  PressRoomPage,
  PrivacyPage,
  PropertyCreatePage,
  PropertyEditPage,
  PropertyListPage,
  ProfileCreatePage,
  ProfileEditPage,
  ProfileListPage,
  ProfileDetailPage,
  RoleCreatePage,
  RoleEditPage,
  RoleListPage,
  RestorationLogsPage,
  SecurityPage,
  SpatialPlanningPage,
  TagsList,
  TagsCreate,
  TagsEdit,
  TermsPage,
  AccountSettingsPage,
  InvitationAcceptPage,
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
            <DynamicResourceProvider
              refineProps={{
                Title: ({ collapsed }: { collapsed: boolean }) => (
                  <div>MCurio</div>
                ),
                routerProvider,
                dataProvider,
                liveProvider,
                notificationProvider: useNotificationProvider,
                authProvider,
                options: {
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  liveMode: "auto",
                  useNewQueryKeys: true,
                },
              }}
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route
                  path="/platform/cms-engine"
                  element={<CmsEnginePage />}
                />
                <Route
                  path="/platform/spatial-planning"
                  element={<SpatialPlanningPage />}
                />
                <Route
                  path="/platform/restoration-logs"
                  element={<RestorationLogsPage />}
                />
                <Route
                  path="/company/our-philosophy"
                  element={<PhilosophyPage />}
                />
                <Route
                  path="/company/ethics-and-provenance"
                  element={<EthicsAndProvenancePage />}
                />
                <Route path="/company/press-room" element={<PressRoomPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route
                  path="/invitation/accept"
                  element={<InvitationAcceptPage />}
                />

                <Route
                  element={
                    <AuthenticationWrapper>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </AuthenticationWrapper>
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
                    <Route path="view/:id" element={<ContactDetailPage />} />
                  </Route>

                  <Route path="/locations">
                    <Route index element={<LocationListPage />} />
                    <Route path="new" element={<LocationCreatePage />} />
                    <Route path="edit/:id" element={<LocationEditPage />} />
                  </Route>

                  <Route path="/tags">
                    <Route index element={<TagsList />} />
                    <Route path="new" element={<TagsCreate />} />
                    <Route path="edit/:id" element={<TagsEdit />} />
                  </Route>

                  <Route path="/condition-reports">
                    <Route
                      index
                      element={
                        <PlanRestrictedRoute
                          requiredFeature="conditionReports"
                          featureName="Condition Reports"
                        >
                          <ConditionReportListPage />
                        </PlanRestrictedRoute>
                      }
                    />
                    <Route
                      path="new"
                      element={
                        <PlanRestrictedRoute
                          requiredFeature="conditionReports"
                          featureName="Condition Reports"
                        >
                          <ConditionReportCreatePage />
                        </PlanRestrictedRoute>
                      }
                    />
                    <Route
                      path="edit/:id"
                      element={
                        <PlanRestrictedRoute
                          requiredFeature="conditionReports"
                          featureName="Condition Reports"
                        >
                          <ConditionReportEditPage />
                        </PlanRestrictedRoute>
                      }
                    />
                  </Route>

                  <Route path="/loans">
                    <Route
                      index
                      element={
                        <PlanRestrictedRoute
                          requiredFeature="loans"
                          featureName="Loans"
                        >
                          <LoanListPage />
                        </PlanRestrictedRoute>
                      }
                    />
                    <Route
                      path="new"
                      element={
                        <PlanRestrictedRoute
                          requiredFeature="loans"
                          featureName="Loans"
                        >
                          <LoanCreatePage />
                        </PlanRestrictedRoute>
                      }
                    />
                    <Route
                      path="edit/:id"
                      element={
                        <PlanRestrictedRoute
                          requiredFeature="loans"
                          featureName="Loans"
                        >
                          <LoanEditPage />
                        </PlanRestrictedRoute>
                      }
                    />
                  </Route>

                  <Route path="/properties">
                    <Route index element={<PropertyListPage />} />
                    <Route path="new" element={<PropertyCreatePage />} />
                    <Route path="edit/:id" element={<PropertyEditPage />} />
                  </Route>

                  <Route path="/exhibitions">
                    <Route
                      index
                      element={
                        <PlanRestrictedRoute
                          requiredFeature="exhibitions"
                          featureName="Exhibitions"
                        >
                          <ExhibitionsListPage />
                        </PlanRestrictedRoute>
                      }
                    />
                    <Route
                      path="new"
                      element={
                        <PlanRestrictedRoute
                          requiredFeature="exhibitions"
                          featureName="Exhibitions"
                        >
                          <ExhibitionCreatePage />
                        </PlanRestrictedRoute>
                      }
                    />
                    <Route
                      path="edit/:id"
                      element={
                        <PlanRestrictedRoute
                          requiredFeature="exhibitions"
                          featureName="Exhibitions"
                        >
                          <ExhibitionEditPage />
                        </PlanRestrictedRoute>
                      }
                    />
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
                    <Route path="view/:id" element={<ProfileDetailPage />} />
                  </Route>

                  <Route path="/roles">
                    <Route index element={<RoleListPage />} />
                    <Route path="new" element={<RoleCreatePage />} />
                    <Route path="edit/:id" element={<RoleEditPage />} />
                  </Route>

                  <Route path="/settings" element={<AccountSettingsPage />} />

                  <Route path="*" element={<ErrorComponent />} />
                </Route>

                {/* Temporarily moved login outside authentication check */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/onboarding" element={<OnboardingFlow />} />

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
                  {/* Empty route for auth redirect handling */}
                </Route>

                <Route path="/no-museum" element={<NoMuseumPage />} />
              </Routes>
              <CookieBanner />
              <UnsavedChangesNotifier />
              <CustomDocumentTitleHandler />
            </DynamicResourceProvider>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
