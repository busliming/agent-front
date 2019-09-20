<template>
    <el-card class="finance-conf">
        <el-tabs
                v-model="activeName"
                type="border-card"
                @tab-click="handleClick"
                @before-leave="handleLeave"
        >
            <el-tab-pane label="库存衰减日志" name="first" ref="first">
                <inventoryReductionLog
                        :levels="levels"
                        :labels="labels"
                        @getLevelList="getLevelListHandle"
                        @getLabelList="getLabelListHandle"
                        :displayLevels="displayLevels"
                        v-if="activeName=='first'"
                        type="1"
                ></inventoryReductionLog>
            </el-tab-pane>
            <el-tab-pane label="玩家单控日志" name="second">
                <playerSingleControlLog
                        :levels="levels"
                        :labels="labels"
                        :displayLevels="displayLevels"
                        v-if="activeName=='second'"
                        type="2"
                ></playerSingleControlLog>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script>

    const inventoryReductionLog = () =>
    import("@/views/controlSystem/components/inventoryReductionLog.vue");
    const playerSingleControlLog = () =>
    import("@/views/controlSystem/components/playerSingleControlLog.vue");
    import controlSystem from '@/request/controlSystem'
    export default {
        name: "log",
        data() {
            return {
                activeName: "first",
                index: 0,
                levels: [],
                labels: []
            };
        },
        components: {
            inventoryReductionLog,
            playerSingleControlLog
        },
        methods: {
            handleClick(tab, event) {
                this.index = tab.index;
                this.activeName = tab.name;
                // console.log(tab.index, this.activeName);
            },
            handleLeave(activeName, oldActiveName) {
                console.log("1", activeName, "2", oldActiveName);
            },
            getLevelListHandle(levelList) {
                this.levels = levelList;
                // this.levels = null;
            },
            getLabelListHandle(labelList) {
                this.labels = labelList;
            },
            displayLevels(row) {
                let levelList = "";
                let tmp = "";
                if (row.userLevel !== undefined && row.userLevel !== null) {
                    if (row.userLevel.length > 0) {
                        tmp = JSON.parse("[" + row.userLevel + "]").map(x => {
                            return parseInt(x, 10);
                    });
                    }
                }
                if (tmp.length) {
                    tmp.forEach((item, idx1) => {
                        if (
                        this.levels !== "" &&
                    this.levels !== null &&
                    this.levels !== undefined
                ) {
                        this.levels.forEach((value, idx2) => {
                            if (item == value.id) {
                            if (idx1 > 0) {
                                levelList += ",";
                            }
                            levelList += value.levelName;
                        }
                    });
                    } else {
                        levelList += "";
                    }
                });
                }
                return levelList;
            }
        },
    }
</script>

<style scoped>

</style>