import {Heading, Table, ToggleGroup} from '@navikt/ds-react'
import styles from './SaksoversiktPage.module.css'
import {List} from "postcss/lib/list";
const SaksoversiktPage = () => {

    const data = {}
    const søkere:Array<string> = []
    const kanSorteres = søkere && søkere?.length > 1;

    return (
        <section className={styles.saksliste__innhold}>
            <Heading size={'large'} level={'1'}>
                Oppgaver AAP
            </Heading>
            <Table size={'medium'} className={styles.saksliste__tabell} zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader sortable={kanSorteres} sortKey={'søknadsdato'}>
                            Søknad
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={kanSorteres} sortKey={'pid'}>
                            Bruker
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={kanSorteres} sortKey={'status'}>
                            Status
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={kanSorteres} sortKey={'sakstype'}>
                            AAP
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>Siste versjon</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                {/*<Table.Body>{tabellInnhold()}</Table.Body>*/}
            </Table>


        </section>
    )

}

export default SaksoversiktPage