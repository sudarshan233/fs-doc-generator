/** Matches the POST /generate request payload. */

export interface WeightOrMeasurement {
  value?: number;
  unit?: string;
}

export interface Party {
  name?: string;
  address?: string;
}

export interface Routing {
  place_of_receipt?: string;
  port_of_loading?: string;
  port_of_discharge?: string;
  place_of_delivery?: string;
}

export interface VesselDetail {
  vessel_name?: string;
  voyage_no?: string;
}

export interface ShipmentDates {
  place_and_date_of_issue?: string;
  freight_payable_at?: string;
}

export interface ContainerDetail {
  container_no?: string;
  container_size?: string;
  seal_no?: string;
  package_count?: number;
  package_type?: string;
  marks_and_numbers?: string;
  description_of_goods?: string;
  hs_code?: string;
  gross_weight?: WeightOrMeasurement;
  net_weight?: WeightOrMeasurement;
  measurement?: WeightOrMeasurement;
}

export interface ReeferDetails {
  temperature?: string;
  humidity?: string;
  ventilation?: string;
}

export interface ShipmentSummary {
  total_containers_received?: number;
  packages_received?: number;
}

export interface PortCharges {
  origin?: string;
  destination?: string;
}

export interface FreightDetails {
  freight_status?: string;
  free_time_at_destination?: string;
  port_charges?: PortCharges;
}

export interface HblItem {
  bill_type?: string;
  sea_waybill_no?: string;
  carrier_reference?: string;
  export_reference?: string;
  consignee_reference?: string;
  carrier?: Party;
  shipper?: Party;
  consignee?: Party;
  notify_party?: Party;
  forwarding_agent?: Party;
  movement_type?: string;
  routing?: Routing;
  vessel_details?: VesselDetail[];
  shipment_dates?: ShipmentDates;
  container_details?: ContainerDetail[];
  reefer_details?: ReeferDetails;
  shipment_summary?: ShipmentSummary;
  freight_details?: FreightDetails;
}

export interface GeneratePayload {
  mbl_number?: string;
  total_count?: number;
  hbl_list?: HblItem[];
}
