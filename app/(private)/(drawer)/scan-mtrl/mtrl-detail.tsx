import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { IMCSDetail } from "~/types/mcs-detail.type";
import { Image } from "expo-image";
import PagerView from "react-native-pager-view";
import mcsApiRequest from "~/apis/mcs.api";
import { Ionicons } from "@expo/vector-icons";
import { envConfig } from "~/constants/config.const";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Info Row Component
const InfoRow = ({
  label,
  value,
  valueStyle = "text-gray-800",
  icon,
}: {
  label: string;
  value: string | number | undefined;
  valueStyle?: string;
  icon?: string;
}) => (
  <View className="flex-row justify-between items-center py-2 px-3 bg-gray-50 rounded-lg mb-1">
    <View className="flex-row items-center flex-1">
      {icon && (
        <Ionicons
          name={icon as any}
          size={16}
          color="#6B7280"
          className="mr-2"
        />
      )}
      <Text className="text-sm text-gray-600 flex-1">{label}</Text>
    </View>
    <Text
      className={`text-sm font-medium ${valueStyle} max-w-[50%] text-right`}
      numberOfLines={2}
    >
      {value || "N/A"}
    </Text>
  </View>
);

// Collapsible Section Component
const CollapsibleSection = ({
  title,
  children,
  defaultExpanded = false,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View className="border-b border-gray-200">
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between p-4 bg-white"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          {icon && (
            <Ionicons
              name={icon as any}
              size={20}
              color="#374151"
              className="mr-3"
            />
          )}
          <Text className="text-lg font-semibold text-gray-900">{title}</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
      {isExpanded && <View className="px-4 pb-4 bg-gray-50">{children}</View>}
    </View>
  );
};

// Helper function to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

// Type cho route params
type RouteParams = {
  data: IMCSDetail;
};

const MtrlDetailStack = () => {
  const route = useRoute<RouteProp<{ McsDetail: any }, "McsDetail">>();
  const dataPrams = route?.params?.data;

  const [mcsInfo, setMcsInfo] = useState<any | null>(null);
  const [mcsImages, setMcsImages] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (dataPrams) {
      setMcsInfo(dataPrams);
      setMcsImages([
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}upload/getImageMTRL_Available/${dataPrams.material_code_supplier_name}`,
      ]);
    } else {
      setIsLoading(false);
    }

    setIsLoading(false);
  }, [dataPrams]);

  // Handle image press
  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Handle modal page change
  const handleModalPageChange = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Render loading state
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-600">Loading product details...</Text>
      </View>
    );
  }

  // Render error state
  if (!mcsInfo) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="mt-2 text-gray-600">No data available</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Block Swiper 6 Images */}
      <View className="h-[220px] bg-white shadow-sm">
        {mcsImages.length > 0 ? (
          <>
            <PagerView
              style={styles.container}
              initialPage={0}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
              {mcsImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  className="justify-center items-center bg-gray-50"
                  onPress={() => handleImagePress(index)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: image ?? "" }}
                    style={styles.image}
                    contentFit="contain"
                    placeholder="Loading..."
                  />
                  {/* Overlay hint */}
                  <View className="absolute top-3 right-3 bg-black/40 rounded-full p-2">
                    <Ionicons name="expand" size={18} color="white" />
                  </View>
                </TouchableOpacity>
              ))}
            </PagerView>

            {/* Page Indicator */}
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {mcsImages.map((_, index) => (
                <View
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full mx-1 ${
                    index === currentPage ? "bg-blue-500" : "bg-white/70"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                  }}
                />
              ))}
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center items-center bg-gray-50">
            <Ionicons name="image-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2">No images available</Text>
          </View>
        )}
      </View>

      {/* Product Info Sections */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header Info - Always Visible */}
        <View className="p-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {mcsInfo.ARTICLE_NUMBER_A}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
            <Text className="text-lg text-blue-600 font-medium ml-2">
              Season: {mcsInfo.SEASON_M}
            </Text>
          </View>
        </View>

        {/* 1. Basic Information */}
        <CollapsibleSection
          title="Basic Information"
          defaultExpanded={true}
          icon="information-circle-outline"
        >
          <InfoRow
            label="Material Type"
            value={mcsInfo.type}
            icon="barcode-outline"
          />
          <InfoRow label="Material Code" value={mcsInfo.material_code} />
          <InfoRow
            label="Supplier"
            value={mcsInfo.supplier_name}
            icon="cube-outline"
          />
          <InfoRow
            label="Supplier Material"
            value={mcsInfo.supplier_material_name}
            icon="storefront-outline"
          />

          <InfoRow
            label="Composition"
            value={mcsInfo.composition}
            icon="storefront-outline"
          />
          <InfoRow
            label="Toolbox"
            value={mcsInfo.toolbox}
            icon="storefront-outline"
          />
          <InfoRow
            label="Request Date"
            value={mcsInfo.request_date}
            icon="storefront-outline"
          />
          <InfoRow
            label="Remark"
            value={mcsInfo.remark}
            icon="storefront-outline"
          />
        </CollapsibleSection>

        {/* 2. Classification */}
        <CollapsibleSection
          title="Classification"
          defaultExpanded={false}
          icon="information-circle-outline"
        >
          <InfoRow
            label="Level 1"
            value={mcsInfo.material_classification_level1}
            icon="barcode-outline"
          />
          <InfoRow
            label="Level 2"
            value={mcsInfo.material_classification_level2}
            icon="barcode-outline"
          />
          <InfoRow
            label="Level 3"
            value={mcsInfo.material_classification_level3}
            icon="barcode-outline"
          />
          <InfoRow
            label="Level 4"
            value={mcsInfo.material_classification_level4}
            icon="barcode-outline"
          />
          <InfoRow
            label="Full Classification"
            value={mcsInfo.material_classification}
            icon="barcode-outline"
          />
        </CollapsibleSection>

        {/* 3. Specifications */}
        <CollapsibleSection
          title="Specifications"
          defaultExpanded={false}
          icon="information-circle-outline"
        >
          <InfoRow label="Width" value={mcsInfo.width} icon="barcode-outline" />

          <InfoRow
            label="Weight"
            value={mcsInfo.weight}
            icon="barcode-outline"
          />

          <InfoRow
            label="Thickness"
            value={mcsInfo.material_thickness}
            icon="barcode-outline"
          />

          <InfoRow
            label="EPM Rating"
            value={mcsInfo.epm_rating}
            icon="barcode-outline"
          />
        </CollapsibleSection>

        {/* 3. Price & Logistics */}
        <CollapsibleSection
          title="Price & Logistics"
          defaultExpanded={false}
          icon="information-circle-outline"
        >
          <InfoRow label="Price" value={mcsInfo.price} icon="barcode-outline" />

          <InfoRow
            label="Shipping Way"
            value={mcsInfo.shipping_way}
            icon="barcode-outline"
          />

          <InfoRow label="ETD" value={mcsInfo.etd} icon="barcode-outline" />

          <InfoRow label="ETA" value={mcsInfo.eta} icon="barcode-outline" />
        </CollapsibleSection>
      </ScrollView>

      {/* Fullscreen Image Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="black" />

          {/* Header with close button */}
          <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center p-4 bg-black/60">
            <View className="flex-row items-center">
              <Text className="text-white text-lg font-medium">
                {selectedImageIndex + 1} / {mcsImages.length}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCloseModal}
              className="bg-black/40 rounded-full p-3"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Fullscreen Image Pager */}
          <PagerView
            style={styles.modalPager}
            initialPage={selectedImageIndex}
            onPageSelected={(e) =>
              handleModalPageChange(e.nativeEvent.position)
            }
          >
            {mcsImages.map((image, index) => (
              <View key={index} style={styles.modalImageContainer}>
                <TouchableOpacity
                  style={styles.modalImageTouchable}
                  onPress={handleCloseModal}
                  activeOpacity={1}
                >
                  <Image
                    source={{ uri: image ?? "" }}
                    style={styles.modalImage}
                    contentFit="contain"
                    placeholder="Loading..."
                  />
                </TouchableOpacity>
              </View>
            ))}
          </PagerView>

          {/* Bottom Page Indicator */}
          <View className="absolute bottom-8 left-0 right-0 flex-row justify-center">
            {mcsImages.map((_, index) => (
              <View
                key={index}
                className={`w-3 h-3 rounded-full mx-1 ${
                  index === selectedImageIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default MtrlDetailStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  modalPager: {
    flex: 1,
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImageTouchable: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: screenWidth,
    height: screenHeight,
  },
});
