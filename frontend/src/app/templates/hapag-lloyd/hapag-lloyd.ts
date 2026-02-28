import { Component } from '@angular/core';
import { HlLabelCell } from './components/hl-label-cell/hl-label-cell';

interface PartyDetails {
  name: string;
  address: string[];
}

interface ContainerDetails {
  containerNo: string;
  sealNo: string;
  marksAndNos: string;
  packages: string[];
  grossWeight: string;
}

interface AdditionalInfo {
  hsCode: string;
  date: string;
  sBillNo: string;
  netWeight: string;
  humidity: string;
  ventilation: string;
  freightTerms: string;
  freeTimeDetention: string;
  originAddress: string;
  temperature: string;
  slacNote: string;
  shippedOnBoardDate: string;
}

interface FreightCharges {
  portChargeOrigin: string;
  seafreight: string;
  portChargeDestination: string;
}

interface PlaceAndDateOfIssue {
  place: string;
  date: string;
}

interface BillOfLadingData {
  carrier: string;
  documentType: string;
  documentSubtype: string;
  shipper: PartyDetails;
  carriersReference: string;
  swbNo: string;
  page: string;
  consignee: PartyDetails;
  notifyAddress: PartyDetails;
  vessels: string[];
  voyageNo: string;
  placeOfDelivery: string;
  portOfLoading: string;
  portOfDischarge: string;
  containers: ContainerDetails[];
  additionalInfo: AdditionalInfo;
  totalContainers: string;
  movement: string;
  freightCharges: FreightCharges;
  placeAndDateOfIssue: PlaceAndDateOfIssue;
  freightPayableAt: string;
  agentName: string;
}

@Component({
  selector: 'app-hapag-lloyd',
  imports: [HlLabelCell],
  templateUrl: './hapag-lloyd.html',
  styleUrl: './hapag-lloyd.css',
})
export class HapagLloyd {
  readonly logoPath = '/assets/hapag-lloyd.png';

  readonly data: BillOfLadingData = {
    carrier: 'Hapag-Lloyd Aktiengesellschaft, Hamburg',
    documentType: 'Sea Waybill',
    documentSubtype: 'Multimodal Transport or Port to Port Shipment',
    shipper: {
      name: 'SLV EXPORTS AND IMPORTS PRIVATE LIMITED',
      address: [
        'MANJEERA TRINITY CORPORATE,',
        'PLOT NO. S2, SURVEY NO. 1050 UNIT NO. 810 & 811, KUKATPALLY, JNTU ROAD,',
        'TELANGANA STATE, INDIA',
      ],
    },
    carriersReference: '54502945',
    swbNo: 'HLCUBO1200545391',
    page: '1 / 1',
    consignee: {
      name: 'JR PRODUCE CORP',
      address: [
        '22750 SW 134TH AVE',
        'MIAMI, FLORIDA 33170',
        'UNITED STATES OF AMERICA (USA)',
      ],
    },
    notifyAddress: {
      name: 'JR PRODUCE CORP',
      address: [
        '22750 SW 134TH AVE',
        'MIAMI, FLORIDA 33170',
        'UNITED STATES OF AMERICA (USA)',
      ],
    },
    vessels: ['BERLIN EXPRESS', 'VIENNA EXPRESS'],
    voyageNo: '2016W / 068W',
    placeOfDelivery: 'MIAMI PORT-FLORIDA, USA',
    portOfLoading: 'MUNDRA, INDIA',
    portOfDischarge: 'MIAMI PORT-FLORIDA, USA',
    containers: [
      {
        containerNo: 'HLXU1234567',
        sealNo: 'SEAL87912',
        marksAndNos: 'SLV / 001 TO 1200',
        packages: [
          '1200 CARTONS FRESH POMEGRANATE ARILS',
          'PACKED IN 20 PALLETS',
          'KEEP REFRIGERATED AT +4 C',
        ],
        grossWeight: '19680 KGS',
      },
      {
        containerNo: 'HLXU7654321',
        sealNo: 'SEAL99121',
        marksAndNos: 'SLV / 1201 TO 2400',
        packages: [
          '1200 CARTONS FRESH POMEGRANATE ARILS',
          'PACKED IN 20 PALLETS',
          'KEEP REFRIGERATED AT +4 C',
        ],
        grossWeight: '19820 KGS',
      },
    ],
    additionalInfo: {
      hsCode: '08109010',
      date: '10-MAY-2020',
      sBillNo: 'SB-5566778',
      netWeight: '19200 KGS',
      humidity: '85%',
      ventilation: '25 CBM/H',
      freightTerms: '"FREIGHT PREPAID"',
      freeTimeDetention: 'FREE TIME / DETENTION AS PER TARIFF',
      originAddress: 'ORIGIN: HYDERABAD, INDIA',
      temperature: '+4 C',
      slacNote: 'SLAC: SHIPPER LOAD, STOW AND COUNT',
      shippedOnBoardDate: '10-MAY-2020',
    },
    totalContainers: '2',
    movement: 'CY / CY',
    freightCharges: {
      portChargeOrigin: 'USD 950',
      seafreight: 'USD 5,200',
      portChargeDestination: 'USD 780',
    },
    placeAndDateOfIssue: {
      place: 'MUNDRA, INDIA',
      date: '10-MAY-2020',
    },
    freightPayableAt: 'MUNDRA, INDIA',
    agentName: 'HAPAG-LLOYD (INDIA) PVT LTD',
  };
}
