import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/src/components/ui/icon";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import {
  MainContainer,
  SearchHeader,
  SearchInputContainer,
  TabsContainer,
  TabButton,
  ContentScrollView,
  EmptyState,
  EmptyStateText,
} from "./styles";
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from "@/src/components/ui/input";
import { ButtonText } from "@/src/components/ui/button";

type SearchTab = "climbs" | "users";

const MainContent = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SearchTab>("climbs");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <MainContainer>
      <SearchHeader>
        <SearchInputContainer>
          <Input style={{ width: "100%" }}>
            <InputField
              placeholder={t("Search")}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            <InputSlot style={{ paddingRight: 6 }}>
              <InputIcon as={SearchIcon} />
            </InputSlot>
          </Input>
        </SearchInputContainer>

        <TabsContainer>
          <TabButton
            active={activeTab === "climbs"}
            onPress={() => setActiveTab("climbs")}
          >
            <ButtonText>{t("Climbs")}</ButtonText>
          </TabButton>
          <TabButton
            active={activeTab === "users"}
            onPress={() => setActiveTab("users")}
          >
            <ButtonText>{t("Users")}</ButtonText>
          </TabButton>
        </TabsContainer>
      </SearchHeader>

      <ContentScrollView>
        {activeTab === "climbs" ? (
          <EmptyState>
            <EmptyStateText>
              {searchQuery
                ? t("No climbs found for your search")
                : t("Search for climbs to see results")}
            </EmptyStateText>
          </EmptyState>
        ) : (
          <EmptyState>
            <EmptyStateText>
              {searchQuery
                ? t("No users found for your search")
                : t("Search for users to see results")}
            </EmptyStateText>
          </EmptyState>
        )}
      </ContentScrollView>
    </MainContainer>
  );
};

export const SearchPage = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DashboardLayout title="Search" isSidebarVisible isHeaderVisible={false}>
        <MainContent />
      </DashboardLayout>
    </SafeAreaView>
  );
};
