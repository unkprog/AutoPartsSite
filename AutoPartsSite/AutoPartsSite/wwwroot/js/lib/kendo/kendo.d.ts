declare module kendo {
    class Class {
        static fn: Class;
        static extend(prototype: Object): Class;
    }

    class Observable extends Class {
        static fn: Observable;
        static extend(prototype: Object): Observable;

        bind(eventName: string, handler: Function): Observable;
        one(eventName: string, handler: Function): Observable;
        trigger(eventName: string, e?: any): boolean;
        unbind(eventName: string, handler?: any): Observable;
    }

    function bind(element: string, viewModel: any, namespace?: any): void;
    function bind(element: string, viewModel: kendo.data.ObservableObject, namespace?: any): void;
    function bind(element: JQuery, viewModel: any, namespace?: any): void;
    function bind(element: JQuery, viewModel: kendo.data.ObservableObject, namespace?: any): void;
    function bind(element: Element, viewModel: any, namespace?: any): void;
    function bind(element: Element, viewModel: kendo.data.ObservableObject, namespace?: any): void;

    function template(templateSource: string): Function;
}

declare module kendo.data {
    interface ObservableObjectEvent {
        sender?: ObservableObject;
        field?: string;
    }

    interface ObservableObjectSetEvent extends ObservableObjectEvent {
        value?: any;
        preventDefault?: Function;
    }


    class Binding extends Observable {
        source: any;
        parents: any[];
        path: string;
        dependencies: { [path: string]: boolean; };
        observable: boolean;
        constructor(parents: any[], path: string);
        change(e: Object): void;
        start(source: kendo.Observable): void;
        stop(source: kendo.Observable): void;
        get(): any;
        set(value: any): void;
        destroy(): void;
    }

    class BindingTarget {
        target: any;
        options: any;
        source: any;
    }

    class EventBinding extends Binding {
        get(): void;
    }

    class TemplateBinding extends Binding {
        constructor(source: kendo.Observable, path: string, template: Function);
        render(value: Object): string;
    }

    module binders { }

    interface Bindings {
        [key: string]: Binding;
    }

    class Binder extends Class {
        static fn: Binder;
        static extend(prototype: Object): Binder;

        element: any;
        bindings: Bindings;
        constructor(element: any, bindings: Bindings, options?: BinderOptions);
        init(element: any, bindings: Bindings, options?: BinderOptions): void;
        bind(binding: Binding, attribute: string): void;
        destroy(): void;
        refresh(): void;
        refresh(attribute: string): void;
        options: BinderOptions;
    }

    interface BinderOptions {
    }

    class ObservableObject extends Observable {
        constructor(value?: any);
        init(value?: any): void;
        get(name: string): any;
        parent(): ObservableObject;
        set(name: string, value: any): void;
        toJSON(): Object;
        uid: string;
    }

    class Model extends ObservableObject {
        idField: string;
        _defaultId: any;
        fields: DataSourceSchemaModelFields;
        defaults: {
            [field: string]: any;
        };
        constructor(data?: any);
        init(data?: any): void;
        dirty: boolean;
        id: any;
        editable(field: string): boolean;
        isNew(): boolean;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof Model;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof Model;
    }

    interface SchedulerEventData {
        description?: string;
        end?: Date;
        endTimezone?: string;
        isAllDay?: boolean;
        id?: any;
        start?: Date;
        startTimezone?: string;
        recurrenceId?: any;
        recurrenceRule?: string;
        recurrenceException?: string;
        title?: string;
    }

    class SchedulerEvent extends Model {
        constructor(data?: SchedulerEventData);
        init(data?: SchedulerEventData): void;

        description: string;
        end: Date;
        endTimezone: string;
        isAllDay: boolean;
        id: any;
        start: Date;
        startTimezone: string;
        recurrenceId: any;
        recurrenceRule: string;
        recurrenceException: string;
        title: string;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof SchedulerEvent;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof SchedulerEvent;
        clone(options: any, updateUid: boolean): SchedulerEvent;
        duration(): number;
        expand(start: Date, end: Date, zone: any): SchedulerEvent[];
        update(eventInfo: SchedulerEventData): void;
        isMultiDay(): boolean;
        isException(): boolean;
        isOccurrence(): boolean;
        isRecurring(): boolean;
        isRecurrenceHead(): boolean;
        toOccurrence(options: any): SchedulerEvent;
    }

    class TreeListModel extends Model {
        constructor(data?: any);
        init(data?: any): void;

        id: any;
        parentId: any;

        loaded(value: boolean): void;
        loaded(): boolean;

        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof TreeListModel;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof TreeListModel;
    }

    class TreeListDataSource extends DataSource {
        load(model: kendo.data.TreeListModel): JQueryPromise<any>;
        childNodes(model: kendo.data.TreeListModel): kendo.data.TreeListModel[];
        rootNodes(): kendo.data.TreeListModel[];
        parentNode(model: kendo.data.TreeListModel): kendo.data.TreeListModel;
        level(model: kendo.data.TreeListModel): number;
        level(model: any): number;

        add(model: Object): kendo.data.TreeListModel;
        add(model: kendo.data.TreeListModel): kendo.data.TreeListModel;
        at(index: number): kendo.data.TreeListModel;
        cancelChanges(model?: kendo.data.TreeListModel): void;
        get(id: any): kendo.data.TreeListModel;
        getByUid(uid: string): kendo.data.TreeListModel;
        indexOf(value: kendo.data.TreeListModel): number;
        insert(index: number, model: kendo.data.TreeListModel): kendo.data.TreeListModel;
        insert(index: number, model: Object): kendo.data.TreeListModel;
        remove(model: kendo.data.TreeListModel): void;
    }

    class GanttTask extends Model {
        constructor(data?: any);
        init(data?: any): void;

        id: any;
        parentId: number;
        orderId: number;
        title: string;
        start: Date;
        end: Date;
        percentComplete: number;
        summary: boolean;
        expanded: boolean;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof GanttTask;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof GanttTask;
    }

    class GanttDependency extends Model {
        constructor(data?: any);
        init(data?: any): void;

        id: any;
        predecessorId: number;
        successorId: number;
        type: number;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof GanttDependency;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof GanttDependency;
    }

    class Node extends Model {
        children: HierarchicalDataSource;

        append(model: any): void;
        level(): number;
        load(id: any): void;
        loaded(value: boolean): void;
        loaded(): boolean;
        parentNode(): Node;
    }

    class SchedulerDataSource extends DataSource {
        add(model: Object): kendo.data.SchedulerEvent;
        add(model: kendo.data.SchedulerEvent): kendo.data.SchedulerEvent;
        at(index: number): kendo.data.SchedulerEvent;
        cancelChanges(model?: kendo.data.SchedulerEvent): void;
        get(id: any): kendo.data.SchedulerEvent;
        getByUid(uid: string): kendo.data.SchedulerEvent;
        indexOf(value: kendo.data.SchedulerEvent): number;
        insert(index: number, model: kendo.data.SchedulerEvent): kendo.data.SchedulerEvent;
        insert(index: number, model: Object): kendo.data.SchedulerEvent;
        remove(model: kendo.data.SchedulerEvent): void;
    }

    class GanttDataSource extends DataSource {
        add(model: Object): kendo.data.GanttTask;
        add(model: kendo.data.GanttTask): kendo.data.GanttTask;
        at(index: number): kendo.data.GanttTask;
        cancelChanges(model?: kendo.data.GanttTask): void;
        get(id: any): kendo.data.GanttTask;
        getByUid(uid: string): kendo.data.GanttTask;
        indexOf(value: kendo.data.GanttTask): number;
        insert(index: number, model: Object): kendo.data.GanttTask;
        insert(index: number, model: kendo.data.GanttTask): kendo.data.GanttTask;
        remove(model: kendo.data.GanttTask): void;
    }

    class GanttDependencyDataSource extends DataSource {
        add(model: Object): kendo.data.GanttDependency;
        add(model: kendo.data.GanttDependency): kendo.data.GanttDependency;
        at(index: number): kendo.data.GanttDependency;
        cancelChanges(model?: kendo.data.GanttDependency): void;
        get(id: any): kendo.data.GanttDependency;
        getByUid(uid: string): kendo.data.GanttDependency;
        indexOf(value: kendo.data.GanttDependency): number;
        insert(index: number, model: Object): kendo.data.GanttDependency;
        insert(index: number, model: kendo.data.GanttDependency): kendo.data.GanttDependency;
        remove(model: kendo.data.GanttDependency): void;
    }

    class HierarchicalDataSource extends DataSource {
        constructor(options?: HierarchicalDataSourceOptions);
        init(options?: HierarchicalDataSourceOptions): void;
    }

    interface HierarchicalDataSourceOptions extends DataSourceOptions {
        schema?: HierarchicalDataSourceSchema;
    }


    interface HierarchicalDataSourceSchema extends DataSourceSchemaWithOptionsModel {
        model?: HierarchicalDataSourceSchemaModel;
    }

    interface HierarchicalDataSourceSchemaModel extends DataSourceSchemaModel {
        hasChildren?: any;
        children?: any;
    }

    interface PivotDiscoverRequestRestrictionOptions {
        catalogName: string;
        cubeName: string;
    }

    interface PivotDiscoverRequestDataOptions {
        command: string;
        restrictions: PivotDiscoverRequestRestrictionOptions;
    }

    interface PivotDiscoverRequestOptions {
        data: PivotDiscoverRequestDataOptions;
    }

    interface PivotTransportConnection {
        catalog?: string;
        cube?: string;
    }

    interface PivotTransportDiscover {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface PivotTransport {
        discover?: any;
        read?: any;
    }

    interface PivotTransportWithObjectOperations extends PivotTransport {
        connection: PivotTransportConnection;
        discover?: PivotTransportDiscover;
        read?: DataSourceTransportRead;
    }

    interface PivotTransportWithFunctionOperations extends PivotTransport {
        discover?: (options: DataSourceTransportOptions) => void;
        read?: (options: DataSourceTransportOptions) => void;
    }

    interface PivotDataSourceAxisOptions {
        name: string;
        expand?: boolean;
    }

    interface PivotDataSourceMeasureOptions {
        values: string[];
        axis?: string;
    }

    interface PivotDataSourceOptions extends DataSourceOptions {
        columns?: PivotDataSourceAxisOptions[];
        measures?: PivotDataSourceMeasureOptions[];
        rows?: PivotDataSourceAxisOptions[];
        transport?: PivotTransport;
        schema?: PivotSchema;
    }

    interface PivotTupleModel {
        children: PivotTupleModel[];
        caption?: string;
        name: string;
        levelName?: string;
        levelNum: number;
        hasChildren?: boolean;
        hierarchy?: string;
    }

    interface PivotSchemaRowAxis {
        tuples: PivotTupleModel[];
    }

    interface PivotSchemaColumnAxis {
        tuples: PivotTupleModel[];
    }

    interface PivotSchemaAxes {
        rows: PivotSchemaRowAxis;
        columns: PivotSchemaColumnAxis;
    }

    interface PivotSchema extends DataSourceSchema {
        axes?: any;
        catalogs?: any;
        cubes?: any;
        data?: any;
        dimensions?: any;
        hierarchies?: any;
        levels?: any;
        measures?: any;
    }

    class PivotDataSource extends DataSource {
        axes(): PivotSchemaAxes;
        constructor(options?: PivotDataSourceOptions);
        init(options?: PivotDataSourceOptions): void;
        catalog(val: string): void;
        columns(val: string[]): string[];
        cube(val: string): void;
        discover(options: PivotDiscoverRequestOptions): JQueryPromise<any>;
        measures(val: string[]): string[];
        measuresAxis(): string;
        rows(val: string[]): string[];
        schemaCatalogs(): JQueryPromise<any>;
        schemaCubes(): JQueryPromise<any>;
        schemaDimensions(): JQueryPromise<any>;
        schemaHierarchies(): JQueryPromise<any>;
        schemaLevels(): JQueryPromise<any>;
        schemaMeasures(): JQueryPromise<any>;
    }

    interface DataSourceTransport {
        parameterMap?(data: DataSourceTransportParameterMapData, type: string): any;
        create?: DataSourceTransportCreate;
        destroy?: DataSourceTransportDestroy;
        push?: Function;
        read?: DataSourceTransportRead;
        signalr?: DataSourceTransportSignalr;
        update?: DataSourceTransportUpdate;
    }

    interface DataSourceTransportSignalrClient {
        create?: string;
        destroy?: string;
        read?: string;
        update?: string;
    }

    interface DataSourceTransportSignalrServer {
        create?: string;
        destroy?: string;
        read?: string;
        update?: string;
    }

    interface DataSourceTransportSignalr {
        client?: DataSourceTransportSignalrClient;
        hub?: any;
        promise?: any;
        server?: DataSourceTransportSignalrServer;
    }


    interface DataSourceParameterMapDataAggregate {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceParameterMapDataGroup {
        aggregate?: DataSourceParameterMapDataAggregate[];
        field?: string;
        dir?: string;
    }

    interface DataSourceParameterMapDataFilter {
        field?: string;
        filters?: DataSourceParameterMapDataFilter[];
        logic?: string;
        operator?: string;
        value?: any;
    }

    interface DataSourceParameterMapDataSort {
        field?: string;
        dir?: string;
    }

    interface DataSourceTransportParameterMapData {
        aggregate?: DataSourceParameterMapDataAggregate[];
        group?: DataSourceParameterMapDataGroup[];
        filter?: DataSourceParameterMapDataFilter;
        models?: Model[];
        page?: number;
        pageSize?: number;
        skip?: number;
        sort?: DataSourceParameterMapDataSort[];
        take?: number;
    }

    interface DataSourceSchema {
        model?: any;
    }

    interface DataSourceSchemaWithOptionsModel extends DataSourceSchema {
        model?: DataSourceSchemaModel;
    }

    interface DataSourceSchemaWithConstructorModel extends DataSourceSchema {
        model?: typeof Model;
    }

    interface DataSourceSchemaModel {
        id?: string;
        fields?: any;
    }

    interface DataSourceSchemaModelWithFieldsArray extends DataSourceSchemaModel {
        fields?: DataSourceSchemaModelField[];
    }

    interface DataSourceSchemaModelWithFieldsObject extends DataSourceSchemaModel {
        fields?: DataSourceSchemaModelFields;
    }

    interface DataSourceSchemaModelFields {
        [index: string]: DataSourceSchemaModelField;
    }

    interface DataSourceSchemaModelField {
        field?: string;
        from?: string;
        defaultValue?: any;
        editable?: boolean;
        nullable?: boolean;
        parse?: Function;
        type?: string;
        validation?: DataSourceSchemaModelFieldValidation;
    }

    interface DataSourceSchemaModelFieldValidation {
        required?: boolean;
        min?: any;
        max?: any;
    }

    class ObservableArray extends Observable {
        constructor(array?: any[]);
        init(array?: any[]): void;
        [index: number]: any;
        length: number;
        join(separator: string): string;
        parent(): ObservableObject;
        pop(): ObservableObject;
        push(...items: any[]): number;
        slice(begin: number, end?: number): any[];
        splice(start: number): any[];
        splice(start: number, deleteCount: number, ...items: any[]): any[];
        shift(): any;
        toJSON(): any[];
        unshift(...items: any[]): number;
        wrapAll(source: Object, target: Object): any;
        wrap(object: Object, parent: Object): any;
        indexOf(item: any): number;
        forEach(callback: (item: Object, index: number, source: ObservableArray) => void): void;
        map(callback: (item: Object, index: number, source: ObservableArray) => any): any[];
        filter(callback: (item: Object, index: number, source: ObservableArray) => boolean): any[];
        find(callback: (item: Object, index: number, source: ObservableArray) => boolean): any;
        every(callback: (item: Object, index: number, source: ObservableArray) => boolean): boolean;
        some(callback: (item: Object, index: number, source: ObservableArray) => boolean): boolean;
        remove(item: Object): void;
    }

    interface ObservableArrayEvent {
        field?: string;
        action?: string;
        index?: number;
        items?: kendo.data.Model[];
    }

    class DataSource extends Observable {
        constructor(options?: DataSourceOptions);
        init(options?: DataSourceOptions): void;
        static create(options?: DataSourceOptions): DataSource;
        options: DataSourceOptions;
        add(model: Object): kendo.data.Model;
        add(model: kendo.data.Model): kendo.data.Model;
        aggregate(val: any): void;
        aggregate(): any;
        aggregates(): any;
        at(index: number): kendo.data.ObservableObject;
        cancelChanges(model?: kendo.data.Model): void;
        data(): kendo.data.ObservableArray;
        data(value: any): void;
        fetch(callback?: Function): void;
        filter(filters: DataSourceFilterItem): void;
        filter(filters: DataSourceFilterItem[]): void;
        filter(filters: DataSourceFilters): void;
        filter(): DataSourceFilters;
        get(id: any): kendo.data.Model;
        getByUid(uid: string): kendo.data.Model;
        group(groups: any): void;
        group(): any;
        hasChanges(): boolean;
        indexOf(value: kendo.data.ObservableObject): number;
        insert(index: number, model: kendo.data.Model): kendo.data.Model;
        insert(index: number, model: Object): kendo.data.Model;
        online(value: boolean): void;
        online(): boolean;
        offlineData(data: any[]): void;
        offlineData(): any[];
        page(): number;
        page(page: number): void;
        pageSize(): number;
        pageSize(size: number): void;
        query(options?: any): void;
        read(data?: any): void;
        remove(model: kendo.data.Model): void;
        sort(sort: DataSourceSortItem): void;
        sort(sort: DataSourceSortItem[]): void;
        sort(): DataSourceSortItem[];
        sync(): void;
        total(): number;
        totalPages(): number;
        view(): kendo.data.ObservableArray;
    }

    interface DataSourceAggregateItem {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceFilter {
    }

    interface DataSourceFilterItem extends DataSourceFilter {
        operator?: string;
        field?: string;
        value?: any;
    }

    interface DataSourceFilters extends DataSourceFilter {
        logic?: string;
        filters?: DataSourceFilter[];
    }

    interface DataSourceGroupItemAggregate {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceGroupItem {
        field?: string;
        dir?: string;
        aggregates?: DataSourceGroupItemAggregate[];
    }

    interface DataSourceSchema {
        aggregates?: any;
        data?: any;
        errors?: any;
        groups?: any;
        parse?: Function;
        total?: any;
        type?: string;
    }

    interface DataSourceSortItem {
        field?: string;
        dir?: string;
    }

    interface DataSourceTransportCreate {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportDestroy {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportRead {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportUpdate {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportWithObjectOperations extends DataSourceTransport {
        create?: DataSourceTransportCreate;
        destroy?: DataSourceTransportDestroy;
        read?: DataSourceTransportRead;
        update?: DataSourceTransportUpdate;
    }

    interface DataSourceTransportWithFunctionOperations extends DataSourceTransport {
        //create?: (options: DataSourceTransportOptions) => DataSourceTransportCreate;
        //destroy?: (options: DataSourceTransportOptions) => DataSourceTransportDestroy;
        //read?: (options: DataSourceTransportReadOptions) => DataSourceTransportRead;
        //update?: (options: DataSourceTransportOptions) => DataSourceTransportUpdate;
    }

    interface DataSourceTransportOptions {
        success: (data?: any) => void;
        error: (error?: any) => void;
        data: any;
    }

    interface DataSourceTransportReadOptionsData {
        sort?: DataSourceSortItem[];
        filter?: DataSourceFilters;
        group?: DataSourceGroupItem[];
        take?: number;
        skip?: number;
    }

    interface DataSourceTransportReadOptions extends DataSourceTransportOptions {
        data: DataSourceTransportReadOptionsData;
    }

    interface DataSourceTransportBatchOptionsData {
        models: any[];
    }

    interface DataSourceTransportBatchOptions extends DataSourceTransportOptions {
        data: DataSourceTransportBatchOptionsData;
    }

    interface DataSourceOptions {
        aggregate?: DataSourceAggregateItem[];
        autoSync?: boolean;
        batch?: boolean;
        data?: any;
        filter?: any;
        group?: DataSourceGroupItem[];
        offlineStorage?: any;
        page?: number;
        pageSize?: number;
        schema?: DataSourceSchema;
        serverAggregates?: boolean;
        serverFiltering?: boolean;
        serverGrouping?: boolean;
        serverPaging?: boolean;
        serverSorting?: boolean;
        sort?: any;
        transport?: DataSourceTransport;
        type?: string;
        change?(e: DataSourceChangeEvent): void;
        error?(e: DataSourceErrorEvent): void;
        sync?(e: DataSourceEvent): void;
        requestStart?(e: DataSourceRequestStartEvent): void;
        requestEnd?(e: DataSourceRequestEndEvent): void;
    }

    interface DataSourceEvent {
        sender?: DataSource;
    }

    interface DataSourceItemOrGroup {
    }

    interface DataSourceGroup extends DataSourceItemOrGroup {
        aggregates: any[];
        field: string;
        hasSubgroups: boolean;
        items: DataSourceItemOrGroup[];
        value: any;
    }

    interface DataSourceChangeEvent extends DataSourceEvent {
        field?: string;
        value?: Model;
        action?: string;
        index?: number;
        items?: DataSourceItemOrGroup[];
        node?: any;
    }

    interface DataSourceErrorEvent extends DataSourceEvent {
        xhr: JQueryXHR;
        status: string;
        errorThrown: any;
        errors?: any;
    }

    interface DataSourceRequestStartEvent extends DataSourceEvent {
    }

    interface DataSourceRequestEndEvent extends DataSourceEvent {
        response?: any;
        type?: string;
    }
}

declare module kendo.data.transports {
    var odata: DataSourceTransport;
}

