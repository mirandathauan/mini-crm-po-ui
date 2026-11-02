export class DashboardSerie {
    label: string = '';
    data: Array<number> = [];
}

export class DashboardResponse {
    series: Array<DashboardSerie> = [];
}
